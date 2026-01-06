import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

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

  const currentPath = location.pathname;
  const redirectPath = location.state?.from?.pathname;

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

// ✅ FIXED: Single array, extracted variables, and proper dependency handling
  useEffect(() => {
    console.log('useEffect inside - checking auth');
    
    const checkAuth = async () => {
      try {
        const { data } = await axiosPrivate.get('/api/protected');
        console.log('✅ Auth check success:', data.user);
        setUser(data.user);
        
        // If user is already logged in and tries to access /login, redirect them
        if (data.user && currentPath === '/login') {
          const from = redirectPath || '/dashboard';
          window.location.href = from; 
        }
      } catch (error) {
        if (error.response?.status !== 401) console.error(error);
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    checkAuth();
    
    // Line 85: Use a single array with the variables you extracted above
  }, [currentPath, redirectPath]);

    checkAuth(); // Run immediately
  }, [[currentPath, redirectPath]]); // Empty deps = run once on mount

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
