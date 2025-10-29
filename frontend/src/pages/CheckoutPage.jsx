import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'sonner';
import api from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processingPayment, setProcessingPayment] = useState(false);

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
      if (response.data.items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/products');
        return;
      }
      setCart(response.data);
    } catch (error) {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      await api.post('/orders/create', null, {
        params: { payment_method: paymentMethod }
      });
    } catch (error) {
      console.error('Failed to create order', error);
    }
  };

  const handleStripePayment = async () => {
    setProcessingPayment(true);
    try {
      const originUrl = window.location.origin;
      const response = await api.post('/payments/stripe/create-session', null, {
        params: {
          amount: cart.total,
          origin_url: originUrl
        }
      });
      
      await createOrder();
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      setProcessingPayment(false);
    }
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-white" data-testid="checkout-title">
            Checkout
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6" data-testid="checkout-summary">
              <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => (
                  <div key={item.product_id} className="flex justify-between text-gray-300">
                    <span>Item {index + 1} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-amber-400" data-testid="checkout-total">${cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Payment Method</h2>
              
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setPaymentMethod('stripe')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  data-testid="payment-stripe"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-6 h-6 text-amber-400" />
                      <span className="text-white font-semibold">Credit/Debit Card</span>
                    </div>
                    {paymentMethod === 'stripe' && (
                      <div className="w-5 h-5 bg-amber-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2 text-left">Powered by Stripe</p>
                </button>
                
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  data-testid="payment-paypal"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">PayPal</span>
                    {paymentMethod === 'paypal' && (
                      <div className="w-5 h-5 bg-amber-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-2 text-left">Pay with PayPal account</p>
                </button>
              </div>
              
              {paymentMethod === 'stripe' && (
                <Button
                  onClick={handleStripePayment}
                  disabled={processingPayment}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 text-lg"
                  data-testid="pay-now-btn"
                >
                  {processingPayment ? 'Processing...' : 'Pay Now'}
                </Button>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="bg-white/5 rounded-lg p-4" data-testid="paypal-info">
                  <p className="text-sm text-amber-400 mb-2">PayPal integration is ready</p>
                  <p className="text-xs text-gray-400">
                    PayPal buttons will appear here once PayPal credentials are configured in the backend.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;