import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Grid,
  List,
  Download,
  Upload
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

const Products: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock products data
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

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredAndSortedProducts = mockProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.barcode?.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
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

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
      toast.success('Product deleted successfully');
    }
  };

  const toggleProductStatus = (product: Product) => {
    const updatedProduct = { ...product, isActive: !product.isActive };
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
    toast.success(`Product ${updatedProduct.isActive ? 'activated' : 'deactivated'}`);
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-soft border border-gray-100 overflow-hidden"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
        <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-600">
            {product.name.charAt(0)}
          </span>
        </div>
        {product.stock <= product.minStock && (
          <div className="absolute top-2 right-2">
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Low Stock
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <div className={`w-3 h-3 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setEditingProduct(product)}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="font-semibold text-gray-900">${product.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stock:</span>
            <span className={`font-medium ${product.stock <= product.minStock ? 'text-orange-600' : 'text-gray-900'}`}>
              {product.stock}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Category:</span>
            <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">{product.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg shadow-soft border border-gray-100 p-4 hover:shadow-medium transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary-600">
            {product.name.charAt(0)}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
            <div className={`w-2 h-2 rounded-full ${product.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
            {product.stock <= product.minStock && (
              <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                Low Stock
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">{product.sku} • {product.category}</p>
          <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-right">
            <div className="font-semibold text-gray-900">${product.price}</div>
            <div className="text-gray-500">Cost: ${product.cost}</div>
          </div>
          <div className="text-right">
            <div className={`font-medium ${product.stock <= product.minStock ? 'text-orange-600' : 'text-gray-900'}`}>
              {product.stock} in stock
            </div>
            <div className="text-gray-500">Min: {product.minStock}</div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingProduct(product)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory and pricing</p>
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
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{mockProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockProducts.filter(p => p.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-soft border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-soft border border-gray-100">
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
                <option value="price">Price</option>
                <option value="stock">Stock</option>
                <option value="createdAt">Date Added</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="bg-white rounded-lg shadow-soft border border-gray-100">
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAndSortedProducts.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
