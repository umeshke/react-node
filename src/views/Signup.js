// views/Login.jsx
import { useForm } from 'react-hook-form';
import { useAuth } from '../controllers/useAuth';

const Signup = () => {
  const { signup, loading } = useAuth();
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(signup)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <input {...register('name')} placeholder="Name" className="w-full p-3 border rounded mb-4" />
      <input {...register('email')} type="email" placeholder="Email" className="w-full p-3 border rounded mb-4" />
      <input {...register('password')} type="password" placeholder="Password" className="w-full p-3 border rounded mb-4" />
      <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600">
        {loading ? 'Loading...' : 'Signup'}
      </button>
    </form>
  );
};
export default Signup;