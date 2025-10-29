import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';
import api from '@/utils/api';

const LandingPage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const response = await api.get('/products');
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent leading-tight" data-testid="hero-title">
              Luxury Redefined
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Discover our curated collection of premium products that blend elegance with functionality.
              Experience shopping reimagined.
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-12 py-6 text-lg rounded-full"
              data-testid="shop-now-btn"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center" data-testid="feature-quality">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Premium Quality</h3>
              <p className="text-gray-400">Handpicked products that meet our highest standards</p>
            </div>
            
            <div className="text-center" data-testid="feature-shipping">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Fast Delivery</h3>
              <p className="text-gray-400">Express shipping to your doorstep worldwide</p>
            </div>
            
            <div className="text-center" data-testid="feature-secure">
              <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Secure Payment</h3>
              <p className="text-gray-400">Multiple payment options with bank-level security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white" data-testid="featured-title">
              Featured Products
            </h2>
            <p className="text-gray-400 text-lg">Our most popular items this season</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="featured-products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/20 px-8 py-6 text-lg"
              data-testid="view-all-btn"
            >
              View All Products
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 LuxeShop. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;