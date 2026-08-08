import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      dispatch(setCredentials({
        user: { name: fullName, email, role: 'Member' },
        token: 'mock-jwt-token'
      }));
      toast.success('Account created!');
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
          <p className="text-text-secondary text-sm">Create your workspace</p>
          <p className="text-text-secondary text-sm">Capture meetings, generate tasks and ship faster.</p>
        </div>

        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-text-secondary block mb-1">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm text-text-secondary block mb-1">Work email</label>
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
                  placeholder="At least 8 characters"
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

            <div>
              <label className="text-sm text-text-secondary block mb-1">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-background-card border border-white/10 rounded-lg px-4 py-2 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showConfirmPassword ? (
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account? <Link to="/signin" className="text-primary hover:text-primary-light transition-colors">Sign in</Link>
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

export default SignUp;