import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState<'user' | 'admin' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (loginType === 'admin' && 
          formData.email === 'admin@123' && 
          formData.password === 'admin@123') {
        login({
          id: 0,
          username: 'Admin',
          email: 'admin@123',
          isAdmin: true
        });
        toast.success('Admin login successful!');
        navigate('/');
        return;
      }

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        login({
          ...userData,
          isAdmin: false
        });
        toast.success(isLogin ? 'Login successful!' : 'Account created successfully!');
        navigate('/');
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!loginType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <h1 className="text-2xl font-bold text-center mb-8">Choose Login Type</h1>
            <div className="space-y-4">
              <button
                onClick={() => setLoginType('admin')}
                className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              {loginType === 'admin' ? 'Admin Login' : (isLogin ? 'Welcome Back' : 'Create Account')}
            </h1>
            <p className="text-gray-500 mt-2">
              {loginType === 'admin' 
                ? 'Sign in to manage the system' 
                : (isLogin ? 'Sign in to manage parking' : 'Sign up to get started')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && loginType === 'user' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {loginType === 'admin' ? 'Sign In as Admin' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {loginType === 'user' && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-500"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <button
              onClick={() => setLoginType(null)}
              className="text-gray-600 hover:text-gray-500"
            >
              Back to login type selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;