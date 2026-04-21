import { createContext, useContext, useState, useEffect } from 'react';
import api from '../Service/ApiService.jsx';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const normalizeRole = (role) => {
  const normalizedRole = String(role ?? '').trim().toUpperCase();

  if (normalizedRole.startsWith('ROLE_')) {
    return normalizedRole.slice(5);
  }

  return normalizedRole;
};

const parseStoredUser = () => {
  const storedUser = localStorage.getItem('adminUser');

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser);

    return {
      ...parsedUser,
      role: normalizeRole(parsedUser?.role),
    };
  } catch (error) {
    localStorage.removeItem('adminUser');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(parseStoredUser);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const normalizedRole = normalizeRole(response.data.role);

      if (normalizedRole !== 'ADMIN') {
        clearAuthState();
        return {
          success: false,
          message: 'Only admin users can log in to the admin panel.',
        };
      }

      const authUser = {
        name:
          response.data.name ??
          response.data.fullName ??
          response.data.username ??
          response.data.userName ??
          response.data.email ??
          email,
        email: response.data.email ?? email,
        role: normalizedRole,
      };

      setToken(response.data.token);
      setUser(authUser);
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(authUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
      };
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const isAdmin = () => {
    return normalizeRole(user?.role) === 'ADMIN';
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    const storedUser = parseStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }

    setLoading(false);
  }, []);

  const logout = () => {
    clearAuthState();
  };

  const contextValue = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
