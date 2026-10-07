import { useState } from 'react';
import { User, Building2, Palette, Bell, Shield, Save } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { theme, toggleTheme, density, toggleDensity } = useTheme();
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/auth/profile`,
        {
          full_name: fullName,
          email: email,
          timezone: timezone
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Update Redux store
      dispatch(setCredentials({
        user: { ...user, full_name: fullName, email: email, timezone: timezone },
        token: token
      }));

      toast.success('Profile updated successfully! 🎉');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Profile</h3>
            <p className="text-sm text-text-secondary">How you appear across the workspace.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary block mb-1">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Role</label>
                <input
                  type="text"
                  value={user?.role || 'Member'}
                  readOnly
                  className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50"
                >
                  <option value="UTC">UTC</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Europe/Berlin">Europe/Berlin</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Australia/Sydney">Australia/Sydney</option>
                </select>
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        );
      case 'workspace':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Workspace</h3>
            <p className="text-sm text-text-secondary">Organization-wide configuration.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary block mb-1">Workspace name</label>
                <input type="text" defaultValue="Northwind Labs" className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Domain</label>
                <input type="text" defaultValue="northwind.taskmind.ai" className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Plan</label>
                <input type="text" defaultValue="Business" className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Seats</label>
                <input type="text" defaultValue="24" className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-text">Appearance</h3>
            <p className="text-sm text-text-secondary">Theme and density preferences.</p>

            <div>
              <label className="text-sm text-text-secondary block mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map((themeOption) => {
                  const isActive = theme === themeOption;
                  const labels = { light: '🌞 Light', dark: '🌙 Dark', system: '💻 System' };
                  return (
                    <button
                      key={themeOption}
                      onClick={() => toggleTheme(themeOption)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        isActive
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 hover:border-primary/30 text-text-secondary hover:text-text'
                      }`}
                    >
                      <div className="text-sm font-medium">{labels[themeOption]}</div>
                      {isActive && <div className="text-xs text-primary mt-1">✓ Active</div>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-2">Density</label>
              <div className="grid grid-cols-3 gap-3">
                {['compact', 'comfortable', 'spacious'].map((densityOption) => {
                  const isActive = density === densityOption;
                  const labels = { compact: '📦 Compact', comfortable: '📏 Comfortable', spacious: '📐 Spacious' };
                  const descriptions = {
                    compact: 'Tighter spacing',
                    comfortable: 'Balanced (default)',
                    spacious: 'More breathing room'
                  };
                  return (
                    <button
                      key={densityOption}
                      onClick={() => toggleDensity(densityOption)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        isActive
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/10 hover:border-primary/30 text-text-secondary hover:text-text'
                      }`}
                    >
                      <div className="text-sm font-medium">{labels[densityOption]}</div>
                      <div className="text-xs text-text-muted mt-1">{descriptions[densityOption]}</div>
                      {isActive && <div className="text-xs text-primary mt-1">✓ Active</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Notifications</h3>
            <p className="text-sm text-text-secondary">Choose what reaches your inbox.</p>
            <div className="space-y-3">
              {['Meeting summaries', 'Task assignments', 'Weekly digest', 'Mentions'].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-background-card/50 rounded-lg">
                  <span className="text-sm text-text">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-primary transition-colors">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 peer-checked:translate-x-5 transition-transform"></div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text">Security</h3>
            <p className="text-sm text-text-secondary">Account protection settings.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-background-card/50 rounded-lg">
                <div>
                  <p className="text-sm text-text">Two-factor authentication</p>
                  <p className="text-xs text-text-muted">Require a second factor when signing in.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-primary transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 peer-checked:translate-x-5 transition-transform"></div>
                  </div>
                </label>
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">Session timeout (minutes)</label>
                <input type="number" defaultValue="60" className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-text-secondary text-sm">Configure your workspace preferences.</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex gap-2 border-b border-white/5 pb-4 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:text-text hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;