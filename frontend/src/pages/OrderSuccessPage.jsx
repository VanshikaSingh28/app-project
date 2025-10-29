import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setVerifying(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    let attempts = 0;
    const maxAttempts = 5;
    
    const poll = async () => {
      if (attempts >= maxAttempts) {
        setVerifying(false);
        setPaymentVerified(true);
        return;
      }
      
      try {
        const response = await api.get(`/payments/stripe/status/${sessionId}`);
        
        if (response.data.payment_status === 'paid') {
          setPaymentVerified(true);
          setVerifying(false);
          return;
        }
        
        attempts++;
        setTimeout(poll, 2000);
      } catch (error) {
        attempts++;
        setTimeout(poll, 2000);
      }
    };
    
    poll();
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12">
            {verifying ? (
              <div data-testid="verifying-payment">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Verifying Payment...
                </h2>
                <p className="text-gray-400">
                  Please wait while we confirm your payment.
                </p>
              </div>
            ) : (
              <div data-testid="payment-success">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                
                <h1 className="text-4xl font-bold text-white mb-4">
                  Order Successful!
                </h1>
                
                <p className="text-lg text-gray-300 mb-8">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
                
                {sessionId && (
                  <div className="bg-white/5 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-400">Transaction ID</p>
                    <p className="text-amber-400 font-mono text-sm break-all" data-testid="transaction-id">
                      {sessionId}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/products')}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                    data-testid="continue-shopping"
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5"
                    data-testid="go-home"
                  >
                    Go to Home
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;