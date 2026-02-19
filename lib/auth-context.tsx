'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'SUPER_ADMIN';
    fullName?: string;
  } | null;  // ADD THIS
  isLoading: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType['user']>(null);  // ADD THIS
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('userEmail');
    const storedUser = localStorage.getItem('user');  // ADD THIS
    
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
      // ADD THIS: Parse and set user data
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user data');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, email: string, userData?: any) => {  // ADD userData param
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', email);
    
    // ADD THIS: Store user data
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
    
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');  // ADD THIS
    setToken(null);
    setUser(null);  // ADD THIS
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      token, 
      user,  // ADD THIS
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
