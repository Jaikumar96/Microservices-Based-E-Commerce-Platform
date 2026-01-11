import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { username, role, token }

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const data = res.data; // { token, username, role }
    const authData = { username: data.username, role: data.role, token: data.token };
    setUser(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
    return authData;
  };

  const register = async (username, email, password, role = 'USER') => {
    await api.post(`/auth/register?role=${role}`, { username, email, password });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  const value = { user, isAuthenticated: !!user, login, logout, register };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
