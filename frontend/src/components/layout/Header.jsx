import { useState } from 'react';
import { Search, Bell, Sun, Moon, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const handleThemeToggle = () => {
    if (theme === 'dark') {
      toggleTheme('light');
    } else {
      toggleTheme('dark');
    }
  };

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm flex-shrink-0">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects, meetings, tasks..."
          className="w-full bg-background-card border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-4">
        {/* Simple Theme Toggle */}
        <button 
          onClick={handleThemeToggle}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-text-secondary" />
          )}
        </button>
        
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button 
          onClick={() => dispatch(logout())}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-text-secondary hover:text-red-400 transition-colors" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
          <div className="text-right">
            <p className="text-sm font-medium text-text">Ava Mercer</p>
            <p className="text-xs text-text-muted">Product Lead</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold">
            AM
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;