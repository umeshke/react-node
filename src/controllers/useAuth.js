// controllers/useAuth.js
import { useState } from 'react';
import { loginUser, signupUser } from '../models/auth';
import { Navigate, useLocation } from 'react-router-dom';




export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

   const location = useLocation();

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      setUser(data.user);    
       if (data.user && location.pathname === '/login') {
          const from = location.state?.from?.pathname || '/dashboard';
          window.location.href = from; // Full reload ensures clean state
        }  
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const data = await signupUser(userData);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  }

  return { user, login, signup, logout, loading };
};
