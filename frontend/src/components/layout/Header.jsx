import { useState } from 'react';
import { Search, Bell, Sun, Moon, LogOut, Monitor } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { clearAll } from '../../store/projectSlice';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Theme options
  const themes = [
    { id: 'light', icon: Sun, label: 'Light Mode' },
    { id: 'dark', icon: Moon, label: 'Dark Mode' },
    { id: 'system', icon: Monitor, label: 'System Default' },
  ];

  // Get current theme icon
  const getCurrentThemeIcon = () => {
    const current = themes.find(t => t.id === theme);
    return current ? current.icon : Sun;
  };

  const CurrentIcon = getCurrentThemeIcon();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return 'U';
  };

  // Get current theme label for display
  const getCurrentThemeLabel = () => {
    const current = themes.find(t => t.id === theme);
    return current ? current.label : 'Theme';
  };

  // ✅ FIXED: Logout handler that clears everything
  const handleLogout = () => {
    // Clear Redux state
    dispatch(clearAll());
    dispatch(logout());
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Navigate to signin
    navigate('/signin');
  };

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm flex-shrink-0 relative z-50">
      {/* Search Bar */}
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

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* Theme Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors border border-white/10"
            title="Change theme"
          >
            <CurrentIcon className="w-4 h-4 text-text-secondary" />
            <span className="text-xs text-text-secondary hidden sm:inline">
              {getCurrentThemeLabel()}
            </span>
          </button>

          {showThemeMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowThemeMenu(false)}
              />
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-56 bg-background-card border border-white/10 rounded-lg shadow-xl py-1 z-50">
                {themes.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        toggleTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-text-secondary hover:text-text hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                      {isActive && (
                        <span className="ml-auto text-primary text-xs">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-white/5 transition-colors relative">
          <Bell className="w-5 h-5 text-text-secondary" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* ✅ FIXED: Logout button now uses handleLogout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-text-secondary hover:text-red-400 transition-colors" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text">
              {user?.full_name || 'User'}
            </p>
            <p className="text-xs text-text-muted">
              {user?.role || 'Member'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-semibold">
            {getUserInitials()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;