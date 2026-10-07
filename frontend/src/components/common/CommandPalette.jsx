import { useState, useEffect, useRef } from 'react';
import { Search, Plus, FolderKanban, ListChecks, Calendar, Users, Bot, FileText, BarChart3, Settings, MessageSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const commands = [
    { 
      category: 'Pages',
      items: [
        { icon: FolderKanban, label: 'Go to Dashboard', action: () => navigate('/'), shortcut: 'G D' },
        { icon: FolderKanban, label: 'Go to Projects', action: () => navigate('/projects'), shortcut: 'G P' },
        { icon: ListChecks, label: 'Go to Tasks', action: () => navigate('/tasks'), shortcut: 'G T' },
        { icon: MessageSquare, label: 'Go to Meetings', action: () => navigate('/meetings'), shortcut: 'G M' },
        { icon: Calendar, label: 'Go to Calendar', action: () => navigate('/calendar'), shortcut: 'G C' },
        { icon: Users, label: 'Go to Team', action: () => navigate('/team'), shortcut: 'G E' },
        { icon: Bot, label: 'Go to AI Assistant', action: () => navigate('/ai-assistant'), shortcut: 'G A' },
        { icon: FileText, label: 'Go to Documents', action: () => navigate('/documents'), shortcut: 'G D' },
        { icon: BarChart3, label: 'Go to Analytics', action: () => navigate('/analytics'), shortcut: 'G A' },
        { icon: Settings, label: 'Go to Settings', action: () => navigate('/settings'), shortcut: 'G S' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { icon: Plus, label: 'Create New Project', action: () => navigate('/projects'), shortcut: 'N P' },
        { icon: Plus, label: 'Create New Task', action: () => navigate('/tasks'), shortcut: 'N T' },
        { icon: Plus, label: 'Schedule Meeting', action: () => navigate('/meetings'), shortcut: 'N M' },
        { icon: Plus, label: 'Upload Document', action: () => navigate('/documents'), shortcut: 'N D' },
      ]
    }
  ];

  // Flatten items for search
  const allItems = commands.flatMap(category => category.items);

  // Filter items based on search
  const filteredItems = search.trim() === '' 
    ? allItems 
    : allItems.filter(item => 
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.shortcut?.toLowerCase().includes(search.toLowerCase())
      );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearch('');
      }
      // Arrow keys for navigation
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        }
        if (e.key === 'Enter' && filteredItems.length > 0) {
          e.preventDefault();
          filteredItems[selectedIndex]?.action();
          setIsOpen(false);
          setSearch('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setIsOpen(false);
          setSearch('');
        }}
      />

      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl">
        <div className="glass-card p-0 overflow-hidden border-primary/20 shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, tasks, meetings..."
              className="flex-1 bg-transparent border-none outline-none text-text placeholder-text-muted text-sm"
            />
            <button
              onClick={() => {
                setIsOpen(false);
                setSearch('');
              }}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-text-muted text-sm">
                No results found for "{search}"
              </div>
            ) : (
              filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isSelected 
                        ? 'bg-primary/20 text-text' 
                        : 'text-text-secondary hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-text-muted'}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded">
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span>⏎ Select</span>
              <span>↑↓ Navigate</span>
              <span>Esc Close</span>
            </div>
            <span className="text-primary">⌘K</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;