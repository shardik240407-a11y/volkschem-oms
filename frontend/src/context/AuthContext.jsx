import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('vcs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vcs_token'));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { username, password });
      const { token: jwt, user: userData } = data.data;

      localStorage.setItem('vcs_token', jwt);
      localStorage.setItem('vcs_user', JSON.stringify(userData));
      setToken(jwt);
      setUser(userData);
      toast.success(`Welcome back, ${userData.full_name}!`);
      return userData;
    } catch (err) {
      // Error toast handled by interceptor
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vcs_token');
    localStorage.removeItem('vcs_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
    window.location.href = '/login';
  }, []);

  // Verify token on mount and handle cross-tab login/logout
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'vcs_token') {
        window.location.reload();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    if (token) {
      api.get('/auth/me')
        .then(({ data }) => {
          const userData = data.data;
          setUser(userData);
          localStorage.setItem('vcs_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token invalid/expired
          localStorage.removeItem('vcs_token');
          localStorage.removeItem('vcs_user');
          setToken(null);
          setUser(null);
        });
    }

    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token]);

  const getPortalPath = useCallback(() => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'employee': return '/employee';
      case 'factory_admin': return '/factory';
      default: return '/login';
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
      getPortalPath,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
