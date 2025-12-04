import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedRole && storedUser) {
          setToken(storedToken);
          setRole(storedRole);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (identifier, password) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      if (data.success && data.token) {
        // Update state
        setToken(data.token);
        setRole(data.role);
        setUser(data.user);

        // Store in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Store role-specific IDs
        if (data.user.studentId) localStorage.setItem('studentId', data.user.studentId);
        if (data.user.teacherId) localStorage.setItem('teacherId', data.user.teacherId);
        if (data.user.adminId) localStorage.setItem('adminId', data.user.adminId);

        return { success: true, role: data.role };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Call backend logout endpoint (optional)
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }).catch(() => {
          // Ignore errors - still logout on frontend
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state
      setToken(null);
      setRole(null);
      setUser(null);

      // Clear localStorage
      localStorage.clear();

      // Redirect to login
      navigate('/');
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!token && !!role && !!user;
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  // Get auth header for API calls
  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const value = {
    user,
    token,
    role,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getAuthHeader,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
