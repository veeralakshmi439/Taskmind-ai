import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Users, Code, Briefcase, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';   // ✅ Uses env var

const SignUp = () => {
  const [step, setStep] = useState(1); // 1: Account Info, 2: Role Selection
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roles = [
    { 
      id: 'project_manager', 
      label: 'Project Manager', 
      icon: Briefcase, 
      description: 'Oversee projects, manage teams, track progress' 
    },
    { 
      id: 'team_leader', 
      label: 'Team Leader', 
      icon: Users, 
      description: 'Lead your team, assign tasks, drive execution' 
    },
    { 
      id: 'developer', 
      label: 'Developer', 
      icon: Code, 
      description: 'Build features, complete tasks, ship code' 
    },
  ];

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validate Step 1 - Account Info
      if (!fullName || !email || !password || !confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      // Move to step 2
      setStep(2);
    } else {
      // Step 2 - Role Selection
      if (!selectedRole) {
        toast.error('Please select a role');
        return;
      }
      // Submit registration
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const requestData = {
        email: email.trim(),
        password: password,
        full_name: fullName.trim(),
        role: selectedRole
      };

      const registerResponse = await axios.post(
        `${API_URL}/api/auth/register`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (registerResponse.data) {
        toast.success('Account created successfully! 🎉');

        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const loginResponse = await axios.post(
          `${API_URL}/api/auth/token`,
          formData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        if (loginResponse.data) {
          const { access_token, user } = loginResponse.data;

          dispatch(setCredentials({
            user: { ...user, role: selectedRole },
            token: access_token,
            remember: false
          }));

          toast.success(`Welcome, ${user.full_name}! 🚀`);
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail || 'Email already registered');
      } else if (error.response?.status === 422) {
        toast.error('Invalid data format. Please check your inputs.');
      } else {
        toast.error(error.response?.data?.detail || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-3xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-text mt-4">TaskMind AI</h1>
          {step === 1 ? (
            <p className="text-text-secondary text-sm">Create your account</p>
          ) : (
            <p className="text-text-secondary text-sm">Select your role</p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary text-white' : 'bg-white/10 text-text-muted'
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary text-white' : 'bg-white/10 text-text-muted'
          }`}>
            2
          </div>
        </div>

        <div className="glass-card p-6">
          {step === 1 ? (
            // Step 1: Account Information
            <form onSubmit={handleContinue} className="space-y-4">
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
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <p className="text-sm text-text-secondary text-center mt-4">
                Already have an account? <Link to="/signin" className="text-primary hover:text-primary-light transition-colors">Sign in</Link>
              </p>
            </form>
          ) : (
            // Step 2: Role Selection
            <div className="space-y-4">
              <p className="text-sm text-text-secondary text-center mb-4">
                Choose the role that best describes you
              </p>

              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 hover:border-primary/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary text-white' : 'bg-white/5 text-text-secondary'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          isSelected ? 'text-primary' : 'text-text'
                        }`}>
                          {role.label}
                        </p>
                        <p className="text-xs text-text-muted">{role.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-4 py-2 bg-background-card border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-text-secondary"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={loading || !selectedRole}
                  className="flex-1 px-4 py-2 bg-primary rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-text-muted">
          <span>30°C</span>
          <span>☁️ Partly cloudy</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;