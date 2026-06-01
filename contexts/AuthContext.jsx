'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../appwrite/auth.js';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const init = async () => {
    try {
      setLoading(true);
      setError(null);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      await authService.login(credentials);
      const user = await authService.getCurrentUser();
      setUser(user);
      return { success: true, user };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await authService.createAccount(userData);
      const user = await authService.getCurrentUser();
      setUser(user);
      return { success: true, user };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const updateProfile = async (data) => {
    try {
      setError(null);
      if (data.name) await authService.updateName(data.name);
      if (data.preferences) await authService.updatePreferences(data.preferences);
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    init();
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
