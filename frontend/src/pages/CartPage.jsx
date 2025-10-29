import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, price, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await api.put('/cart/update', {
        product_id: productId,
        quantity: newQuantity,
        price,
      });
      await loadCart();
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-white" data-testid="cart-title">
            Shopping Cart
          </h1>
          
          {cart.items.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl" data-testid="empty-cart">
              <p className="text-gray-400 text-xl mb-8">Your cart is empty</p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-amber-500 hover:bg-amber-600 text-black"
                data-testid="continue-shopping-btn"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item, index) => (
                  <div
                    key={item.product_id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center space-x-6"
                    data-testid={`cart-item-${index}`}
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Product #{item.product_id.slice(0, 8)}
                      </h3>
                      <p className="text-2xl font-bold text-amber-400">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.price, item.quantity - 1)}
                        className="border-white/20 text-white"
                        data-testid={`decrease-${index}`}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold w-12 text-center" data-testid={`quantity-${index}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product_id, item.price, item.quantity + 1)}
                        className="border-white/20 text-white"
                        data-testid={`increase-${index}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white mb-2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product_id)}
                        className="text-red-400 hover:text-red-500"
                        data-testid={`remove-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit" data-testid="order-summary">
                <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span data-testid="subtotal">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400" data-testid="total">${cart.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={proceedToCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 text-lg"
                  data-testid="checkout-btn"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;