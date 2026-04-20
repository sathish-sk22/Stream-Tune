import { createContext, useContext, useMemo, useState } from 'react';
import api from '../Service/ApiService.jsx';

export const AuthContext = createContext();
const ADMIN_ROLE = 'ROLE_ADMIN';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  const storedUser = localStorage.getItem('adminUser');
  const parsedStoredUser = storedUser ? JSON.parse(storedUser) : null;
  const isStoredAdmin = parsedStoredUser?.role === ADMIN_ROLE;
  const [user, setUser] = useState(isStoredAdmin ? parsedStoredUser : null);
  const [token, setToken] = useState(isStoredAdmin ? localStorage.getItem('adminToken') : null);
  const [loading, setLoading] = useState(false);

  if (!isStoredAdmin && (storedUser || localStorage.getItem('adminToken'))) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const role = response.data.role;

      if (role !== ADMIN_ROLE) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        return {
          success: false,
          message: 'Only admin users can log in to the admin panel',
        };
      }

      const authUser = {
        email: response.data.email ?? email,
        role,
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

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const contextValue = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(token) && user?.role === ADMIN_ROLE,
      isAdmin: user?.role === ADMIN_ROLE,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
