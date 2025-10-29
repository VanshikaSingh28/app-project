import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const OrderCancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12" data-testid="order-cancelled">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-400" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment Cancelled
            </h1>
            
            <p className="text-lg text-gray-300 mb-8">
              Your payment was cancelled. No charges were made to your account.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/cart')}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                data-testid="return-cart-btn"
              >
                Return to Cart
              </Button>
              <Button
                onClick={() => navigate('/products')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
                data-testid="continue-shopping-btn"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancelPage;