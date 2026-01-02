import Login from '../views/Login';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation  } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginPage(){
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && user) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, location]);

    // if (loading) return <div>Loading...</div>;

    // const handleLogin = async (email, password) => {
    //     // Your login API call
    //     const userData = { id: 1, name: 'John', email }; // Mock
    //     login(userData);
    //     navigate('/dashboard', { replace: true });
    // };

    return (
        <>
            <Login />
        </>
    )
}