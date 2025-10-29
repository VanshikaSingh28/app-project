import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/utils/api';
import { setToken, setUser } from '@/utils/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, { email, password });
      
      setToken(response.data.token);
      setUser(response.data.user);
      
      toast.success(isLogin ? 'Logged in successfully' : 'Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (role) => {
    setLoading(true);
    try {
      const credentials = role === 'admin' 
        ? { email: 'admin@shop.com', password: 'admin123' }
        : { email: 'customer@shop.com', password: 'customer123' };
      
      const response = await api.post('/auth/login', credentials);
      
      setToken(response.data.token);
      setUser(response.data.user);
      
      toast.success(`Logged in as ${role}`);
      navigate(role === 'admin' ? '/admin' : '/');
    } catch (error) {
      if (role === 'customer') {
        toast.info('Creating demo customer account...');
        try {
          const response = await api.post('/auth/register', {
            email: 'customer@shop.com',
            password: 'customer123'
          });
          setToken(response.data.token);
          setUser(response.data.user);
          toast.success('Demo customer account created');
          navigate('/');
        } catch (err) {
          toast.error('Failed to create demo account');
        }
      } else {
        toast.error('Demo admin login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-white mb-8 text-center" data-testid="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-300 mb-2">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="your@email.com"
                  required
                  data-testid="email-input"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300 mb-2">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="••••••••"
                  required
                  data-testid="password-input"
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6"
                data-testid="submit-btn"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-400 hover:text-amber-500 text-sm"
                data-testid="toggle-auth-btn"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
              </button>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-400 text-center mb-4">Demo Accounts</p>
              <div className="space-y-3">
                <Button
                  onClick={() => loginAsDemo('admin')}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                  data-testid="demo-admin-btn"
                >
                  Login as Admin
                </Button>
                <Button
                  onClick={() => loginAsDemo('customer')}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-white/20 text-gray-300 hover:bg-white/5"
                  data-testid="demo-customer-btn"
                >
                  Login as Customer
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                Admin: admin@shop.com / admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;