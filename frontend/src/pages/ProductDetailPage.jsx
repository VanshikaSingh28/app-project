import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated()) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await api.post('/cart/add', {
        product_id: product.id,
        quantity,
        price: product.price,
      });
      toast.success('Added to cart');
      navigate('/cart');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="mb-8 text-gray-300 hover:text-amber-400"
            data-testid="back-btn"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="relative aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="product-image"
              />
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-sm text-amber-400 uppercase tracking-wider" data-testid="product-category">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mt-2 text-white" data-testid="product-name">
                  {product.name}
                </h1>
              </div>
              
              <p className="text-5xl font-bold text-amber-400" data-testid="product-price">
                ${product.price.toFixed(2)}
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-4 py-6 border-t border-b border-white/10">
                <span className="text-gray-400">Quantity:</span>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-white/20 text-white"
                    data-testid="decrease-quantity"
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center" data-testid="quantity-display">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 border-white/20 text-white"
                    data-testid="increase-quantity"
                  >
                    +
                  </Button>
                </div>
                <span className="text-sm text-gray-500" data-testid="stock-info">
                  {product.stock} in stock
                </span>
              </div>
              
              <Button
                onClick={addToCart}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6 text-lg"
                data-testid="add-to-cart-btn"
              >
                <ShoppingCart className="mr-2 w-5 h-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;