import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListChecks, 
  Calendar, 
  Users, 
  Bot, 
  FileText, 
  BarChart3, 
  Settings,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/meetings', icon: MessageSquare, label: 'Meetings' },
  { path: '/tasks', icon: ListChecks, label: 'Tasks' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/team', icon: Users, label: 'Team' },
  { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  { path: '/documents', icon: FileText, label: 'Documents' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-background-sidebar border-r border-white/5 flex flex-col h-screen flex-shrink-0">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-text">TaskMind AI</h1>
            <p className="text-xs text-text-muted">Meeting to execution</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Phase 1 preview banner removed */}

    </aside>
  );
};

export default Sidebar;