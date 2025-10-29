import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
import { getUser, isAuthenticated, logout, isAdmin } from '@/utils/auth';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const navigate = useNavigate();
  const user = getUser();
  const authenticated = isAuthenticated();
  const admin = isAdmin();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f1a]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
          <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            LuxeShop
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-amber-400 transition-colors"
            data-testid="nav-home"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="text-gray-300 hover:text-amber-400 transition-colors"
            data-testid="nav-products"
          >
            Products
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {authenticated ? (
            <>
              {admin && (
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin')}
                  className="bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30"
                  data-testid="admin-dashboard-btn"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="text-gray-300 hover:text-amber-400"
                data-testid="cart-btn"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400"
                data-testid="logout-btn"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
              data-testid="login-btn"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};