import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const addToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart/add', {
        product_id: product.id,
        quantity: 1,
        price: product.price,
      });
      toast.success('Added to cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
      data-testid={`product-card-${product.id}`}
    >
      <div className="aspect-square overflow-hidden bg-white/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-amber-400 uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-amber-400">
            ${product.price.toFixed(2)}
          </span>
          
          <Button
            onClick={addToCart}
            className="bg-amber-500 hover:bg-amber-600 text-black"
            size="sm"
            data-testid={`add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};