import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const axiosPrivate = axios.create({ baseURL: 'http://localhost:5000', withCredentials: true });



axiosPrivate.interceptors.response.use(
  response => response,
  async error => {
    console.log("error.response===",error.response)
    if (error.response?.status === 401) {
      // Logout or refresh logic
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const login = async (credentials) => {
    setLoading(true); // Add this
    try {
      await axiosPrivate.post('/api/auth/login', credentials);
      const { data } = await axiosPrivate.get('/api/protected');
      setUser(data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw for form handling
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      await axiosPrivate.post('/api/auth/signup', userData);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  // ✅ FIXED useEffect - Check auth ONCE on mount
  useEffect(() => {
    console.log('useEffect inside - checking auth');
    const checkAuth = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/protected');
        console.log('✅ Auth check success:', data.user);
        setUser(data.user);
        
        if (data.user && location.pathname === '/login') {
          const from = location.state?.from?.pathname || '/dashboard';
          window.location.href = from; // Full reload ensures clean state
        }
      } catch (error) {
        console.log('❌ No valid session');
        if (error.response?.status !== 401) console.error(error);
        setLoading(false);
        setUser(null);
      } finally {
        setLoading(false); // Always set loading false
      }
    };

    checkAuth(); // Run immediately
  }, []); // Empty deps = run once on mount

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, axiosPrivate }}>
      {children}
    </AuthContext.Provider>
  );
};
