// components/Header.jsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 
              className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600"
              onClick={() => navigate('/dashboard')}
            >
              MyApp
            </h1>
          </div>

          {/* Right side - Conditional based on auth */}
          <div className="flex items-center space-x-4">
            
            {user ? (
              /* ✅ LOGGED IN - Show user info + logout */
              <>
                <span className="text-sm text-gray-700 hidden md:block">
                  Welcome, {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              /* ❌ NOT LOGGED IN - Show login/signup */
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-700 hover:text-blue-600 font-medium text-sm"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
