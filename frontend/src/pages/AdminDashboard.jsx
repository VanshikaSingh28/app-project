import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/utils/api';
import { isAdmin } from '@/utils/auth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total_products: 0, total_orders: 0, total_revenue: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
  });

  useEffect(() => {
    if (!isAdmin()) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/products'),
        api.get('/orders'),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      toast.success('Product created');
      setIsDialogOpen(false);
      resetForm();
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${editingProduct.id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
      toast.success('Product updated');
      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: '',
    });
    setEditingProduct(null);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, null, { params: { status } });
      toast.success('Order status updated');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-12 text-white" data-testid="admin-title">
            Admin Dashboard
          </h1>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6" data-testid="stat-products">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-amber-400" />
                <span className="text-3xl font-bold text-white">{stats.total_products}</span>
              </div>
              <p className="text-gray-400">Total Products</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6" data-testid="stat-orders">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag className="w-8 h-8 text-amber-400" />
                <span className="text-3xl font-bold text-white">{stats.total_orders}</span>
              </div>
              <p className="text-gray-400">Total Orders</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6" data-testid="stat-revenue">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-amber-400" />
                <span className="text-3xl font-bold text-white">${stats.total_revenue.toFixed(2)}</span>
              </div>
              <p className="text-gray-400">Total Revenue</p>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 mb-8">
              <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Manage Products</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={resetForm}
                      className="bg-amber-500 hover:bg-amber-600 text-black"
                      data-testid="add-product-btn"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a2e] border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        {editingProduct ? 'Update product details' : 'Fill in the product information'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          required
                          data-testid="product-name-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          required
                          data-testid="product-description-input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                            required
                            data-testid="product-price-input"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            className="bg-white/5 border-white/10 text-white"
                            required
                            data-testid="product-stock-input"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          required
                          data-testid="product-category-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                          required
                          data-testid="product-image-input"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                        data-testid="save-product-btn"
                      >
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid grid-cols-1 gap-4" data-testid="products-list">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between"
                    data-testid={`product-${product.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <p className="text-sm text-gray-400">{product.category}</p>
                        <p className="text-amber-400 font-bold">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="border-white/20 text-white"
                        data-testid={`edit-${product.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        data-testid={`delete-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="orders">
              <h2 className="text-2xl font-semibold text-white mb-6">Manage Orders</h2>
              
              <div className="space-y-4" data-testid="orders-list">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                    data-testid={`order-${order.id}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-400">Order ID</p>
                        <p className="text-white font-mono">{order.id.slice(0, 8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total</p>
                        <p className="text-2xl font-bold text-amber-400">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-400">Customer</p>
                      <p className="text-white">{order.user_email}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Status</p>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-white/5 border border-white/10 text-white rounded-lg px-4 py-2"
                          data-testid={`status-${order.id}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Items</p>
                        <p className="text-white">{order.items.length} items</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
