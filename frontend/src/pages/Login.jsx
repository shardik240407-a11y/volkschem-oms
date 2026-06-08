import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, loading, isAuthenticated, getPortalPath } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate(getPortalPath(), { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    try {
      const user = await login(username.trim(), password);
      const portalMap = { admin: '/admin', employee: '/employee', factory_admin: '/factory' };
      navigate(portalMap[user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle botanical background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath d='M40 10 C35 20, 20 25, 15 40 C10 55, 25 65, 40 70 C55 65, 70 55, 65 40 C60 25, 45 20, 40 10Z' fill='%231B5E20' /%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Login Card */}
      <div className="relative bg-white rounded-2xl shadow-card-hover w-full max-w-md p-8 animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center bg-white rounded-md p-2 shadow-sm mb-4">
            <img src="/logo.png" alt="Volkschem Logo" className="h-16 object-contain" />
          </div>
          <h1 className="text-primary font-extrabold text-2xl tracking-wide">VOLKSCHEM</h1>
          <p className="text-text-primary font-semibold text-sm mt-0.5">CROP SCIENCE (P) LIMITED</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-8 h-px bg-action" />
            <p className="text-action text-sm italic font-medium">Symbol of Quality</p>
            <span className="w-8 h-px bg-action" />
          </div>
        </div>

        {/* Welcome */}
        <div className="text-center mb-6">
          <h2 className="text-primary text-xl font-bold italic">Welcome Back</h2>
          <p className="text-text-secondary text-sm mt-1">Sign in to access Volkschem OMS</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-2.5 bg-error-light border border-error/20 rounded-lg">
            <p className="text-error text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-lighter/40 focus:border-primary-lighter
                placeholder:text-text-muted transition-colors"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-3 border border-border rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-lighter/40 focus:border-primary-lighter
                placeholder:text-text-muted transition-colors"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary hover:bg-primary-light text-white font-bold text-base
              rounded-lg transition-all duration-200 flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]
              shadow-sm hover:shadow-md"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            Sign In
          </button>
        </form>
      </div>

      {/* Copyright */}
      <p className="mt-8 text-text-muted text-xs">
        © {new Date().getFullYear()} Volkschem Crop Science Pvt. Ltd.
      </p>
    </div>
  );
}
