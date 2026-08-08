import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      dispatch(setCredentials({
        user: { name: 'Ava Mercer', email, role: 'Product Lead' },
        token: 'mock-jwt-token'
      }));
      toast.success('Welcome back!');
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-3xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-text mt-4">TaskMind AI</h1>
          <p className="text-text-secondary text-sm">Welcome back</p>
          <p className="text-text-secondary text-sm">Sign in to pick up where your team left off.</p>
        </div>

        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-text-muted text-center mt-4">
            Phase 1 demo — any valid-looking credentials open the workspace.
          </p>

          <p className="text-sm text-text-secondary text-center mt-6">
            New here? <Link to="/signup" className="text-primary hover:text-primary-light transition-colors">Create an account</Link>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-text-muted">
          <span>30°C</span>
          <span>☁️ Partly cloudy</span>
          <span>9:59 PM</span>
          <span>8/3/2026</span>
        </div>
      </div>
    </div>
  );
};

export default SignIn;