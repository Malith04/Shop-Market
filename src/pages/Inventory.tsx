import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Minus,
  Edit,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  RefreshCw,
  Eye,
  EyeOff,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package2,
  ShoppingCart,
  DollarSign
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, InventoryMovement } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Inventory: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('stock');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showLowStock, setShowLowStock] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'in' | 'out' | 'adjustment'>('adjustment');

  // Mock products data with more inventory details
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with Pro features and advanced camera system',
      price: 999.99,
      cost: 800.00,
      category: 'Electronics',
      sku: 'IPH15P-001',
      barcode: '1234567890123',
      stock: 25,
      minStock: 5,
      maxStock: 50,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      description: 'Premium Android smartphone with AI features',
      price: 899.99,
      cost: 700.00,
      category: 'Electronics',
      sku: 'SGS24-001',
      barcode: '1234567890124',
      stock: 18,
      minStock: 5,
      maxStock: 40,
      isActive: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
    },
    {
      id: '3',
      name: 'MacBook Air M2',
      description: 'Ultra-thin laptop with M2 chip and all-day battery',
      price: 1199.99,
      cost: 1000.00,
      category: 'Electronics',
      sku: 'MBA-M2-001',
      barcode: '1234567890125',
      stock: 12,
      minStock: 3,
      maxStock: 25,
      isActive: true,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '4',
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Max Air cushioning',
      price: 150.00,
      cost: 100.00,
      category: 'Shoes',
      sku: 'NAM270-001',
      barcode: '1234567890126',
      stock: 30,
      minStock: 10,
      maxStock: 60,
      isActive: true,
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-19'),
    },
    {
      id: '5',
      name: 'Adidas Ultraboost 22',
      description: 'High-performance running shoes with Boost technology',
      price: 180.00,
      cost: 120.00,
      category: 'Shoes',
      sku: 'AUB22-001',
      barcode: '1234567890127',
      stock: 22,
      minStock: 8,
      maxStock: 45,
      isActive: true,
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: '6',
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless headphones',
      price: 199.99,
      cost: 150.00,
      category: 'Electronics',
      sku: 'WH-001',
      barcode: '1234567890128',
      stock: 3,
      minStock: 5,
      maxStock: 30,
      isActive: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-22'),
    },
  ];

  // Mock inventory movements
  const mockMovements: InventoryMovement[] = [
    {
      id: '1',
      productId: '1',
      type: 'in',
      quantity: 50,
      reason: 'Initial stock',
      userId: '1',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      productId: '1',
      type: 'out',
      quantity: 25,
      reason: 'Sales',
      userId: '1',
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      productId: '6',
      type: 'adjustment',
      quantity: -2,
      reason: 'Damaged items',
      userId: '1',
      createdAt: new Date('2024-01-22'),
    },
  ];

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLowStock = !showLowStock || product.stock <= product.minStock;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    let aValue: any = a[sortBy as keyof Product];
    let bValue: any = b[sortBy as keyof Product];
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const lowStockProducts = mockProducts.filter(p => p.stock <= p.minStock);
  const outOfStockProducts = mockProducts.filter(p => p.stock === 0);
  const totalInventoryValue = mockProducts.reduce((total, product) => total + (product.stock * product.cost), 0);
  const totalProducts = mockProducts.length;

  const handleStockAdjustment = () => {
    if (!selectedProduct || !adjustmentQuantity || !adjustmentReason) {
      toast.error('Please fill in all fields');
      return;
    }

    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity === 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Create movement record
    const movement: InventoryMovement = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      type: adjustmentType,
      quantity: adjustmentType === 'out' ? -Math.abs(quantity) : Math.abs(quantity),
      reason: adjustmentReason,
      userId: state.currentUser?.id || '1',
      createdAt: new Date(),
    };

    // Update product stock
    const updatedProduct = {
      ...selectedProduct,
      stock: selectedProduct.stock + movement.quantity,
      updatedAt: new Date(),
    };

    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    toast.success('Stock adjusted successfully');
    
    setShowAdjustmentModal(false);
    setSelectedProduct(null);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
  };

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (product.stock <= product.minStock) return { status: 'Low Stock', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (product.stock >= product.maxStock * 0.9) return { status: 'High Stock', color: 'text-green-600', bg: 'bg-green-100' };
    return { status: 'In Stock', color: 'text-blue-600', bg: 'bg-blue-100' };
  };

  const getStockPercentage = (product: Product) => {
    return (product.stock / product.maxStock) * 100;
  };

  const InventoryCard: React.FC<{ product: Product }> = ({ product }) => {
    const stockStatus = getStockStatus(product);
    const stockPercentage = getStockPercentage(product);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden card-hover"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {product.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.sku}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
              {stockStatus.status}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Current Stock</span>
                <span className="font-semibold">{product.stock} units</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stockPercentage > 80 ? 'bg-green-500' :
                    stockPercentage > 50 ? 'bg-blue-500' :
                    stockPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Min: {product.minStock}</span>
                <span>Max: {product.maxStock}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Cost Price:</span>
                <div className="font-semibold text-gray-900">${product.cost}</div>
              </div>
              <div>
                <span className="text-gray-600">Value:</span>
                <div className="font-semibold text-gray-900">${(product.stock * product.cost).toFixed(2)}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setAdjustmentType('in');
                  setShowAdjustmentModal(true);
                }}
                className="flex-1 btn btn-success py-2 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Stock
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setAdjustmentType('out');
                  setShowAdjustmentModal(true);
                }}
                className="flex-1 btn btn-warning py-2 text-sm"
              >
                <Minus className="h-4 w-4 mr-1" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track and manage your product inventory</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary px-4 py-2">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button className="btn btn-secondary px-4 py-2">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          <button className="btn btn-primary px-4 py-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Package2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts.length}</p>
          </div>
        </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalInventoryValue.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showLowStock
                  ? 'bg-orange-100 text-orange-700 border border-orange-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <AlertTriangle className="h-4 w-4 mr-2 inline" />
              Low Stock Only
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="name">Name</option>
                <option value="stock">Stock</option>
                <option value="price">Price</option>
                <option value="createdAt">Date Added</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {sortOrder === 'asc' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <InventoryCard key={product.id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
      )}

      {/* Stock Adjustment Modal */}
      <AnimatePresence>
        {showAdjustmentModal && selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAdjustmentModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-96 max-w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Adjust Stock</h3>
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeOff className="h-6 w-6" />
                </button>
              </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                    <div className="text-sm text-gray-500">Current Stock: {selectedProduct.stock}</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adjustment Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'in', label: 'Add Stock', icon: Plus, color: 'bg-green-100 text-green-700' },
                      { value: 'out', label: 'Remove Stock', icon: Minus, color: 'bg-red-100 text-red-700' },
                      { value: 'adjustment', label: 'Adjust', icon: Edit, color: 'bg-blue-100 text-blue-700' },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          onClick={() => setAdjustmentType(type.value as any)}
                          className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${
                            adjustmentType === type.value
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{type.label}</span>
                  </button>
                      );
                    })}
                  </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                    placeholder="Enter quantity"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                    placeholder="Enter reason for adjustment"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
                <div className="flex space-x-3">
                <button
                    onClick={() => setShowAdjustmentModal(false)}
                  className="flex-1 btn btn-secondary py-2"
                >
                  Cancel
                </button>
                <button
                    onClick={handleStockAdjustment}
                  className="flex-1 btn btn-primary py-2"
                >
                    Apply Adjustment
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;