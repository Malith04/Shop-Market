import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Receipt,
  Calendar,
  DollarSign,
  ShoppingCart,
  User,
  CreditCard,
  Smartphone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Sale, PaymentMethod, SaleStatus } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Sales: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SaleStatus | 'all'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [dateRange, setDateRange] = useState('7d');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);

  // Mock sales data
  const mockSales: Sale[] = [
    {
      id: '1',
      items: [
        {
          product: {
            id: '1',
            name: 'iPhone 15 Pro',
            description: 'Latest iPhone with Pro features',
            price: 999.99,
            cost: 800.00,
            category: 'Electronics',
            sku: 'IPH15P-001',
            barcode: '1234567890123',
            stock: 25,
            minStock: 5,
            maxStock: 50,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
          discount: 0,
        },
        {
          product: {
            id: '2',
            name: 'AirPods Pro',
            description: 'Wireless earbuds with noise cancellation',
            price: 249.99,
            cost: 150.00,
            category: 'Electronics',
            sku: 'APP-001',
            barcode: '1234567890129',
            stock: 40,
            minStock: 10,
            maxStock: 80,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
          discount: 0,
        }
      ],
      subtotal: 1249.98,
      tax: 99.99,
      discount: 50.00,
      total: 1299.97,
      paymentMethod: 'card',
      customerId: '1',
      cashierId: '1',
      createdAt: new Date('2024-01-22T10:30:00'),
      status: 'completed',
      receiptNumber: 'RCP-001234',
    },
    {
      id: '2',
      items: [
        {
          product: {
            id: '3',
            name: 'Samsung Galaxy S24',
            description: 'Premium Android smartphone',
            price: 899.99,
            cost: 700.00,
            category: 'Electronics',
            sku: 'SGS24-001',
            barcode: '1234567890124',
            stock: 18,
            minStock: 5,
            maxStock: 40,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
          discount: 0,
        }
      ],
      subtotal: 899.99,
      tax: 72.00,
      discount: 0,
      total: 971.99,
      paymentMethod: 'cash',
      customerId: '2',
      cashierId: '1',
      createdAt: new Date('2024-01-22T14:15:00'),
      status: 'completed',
      receiptNumber: 'RCP-001235',
    },
    {
      id: '3',
      items: [
        {
          product: {
            id: '4',
            name: 'Nike Air Max 270',
            description: 'Comfortable running shoes',
            price: 150.00,
            cost: 100.00,
            category: 'Shoes',
            sku: 'NAM270-001',
            barcode: '1234567890126',
            stock: 30,
            minStock: 10,
            maxStock: 60,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 2,
          discount: 0,
        }
      ],
      subtotal: 300.00,
      tax: 24.00,
      discount: 0,
      total: 324.00,
      paymentMethod: 'mobile',
      customerId: '3',
      cashierId: '1',
      createdAt: new Date('2024-01-21T16:45:00'),
      status: 'pending',
      receiptNumber: 'RCP-001236',
    },
    {
      id: '4',
      items: [
        {
          product: {
            id: '5',
            name: 'MacBook Air M2',
            description: 'Ultra-thin laptop with M2 chip',
            price: 1199.99,
            cost: 1000.00,
            category: 'Electronics',
            sku: 'MBA-M2-001',
            barcode: '1234567890125',
            stock: 12,
            minStock: 3,
            maxStock: 25,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
          discount: 100.00,
        }
      ],
      subtotal: 1199.99,
      tax: 88.00,
      discount: 100.00,
      total: 1187.99,
      paymentMethod: 'card',
      customerId: '4',
      cashierId: '1',
      createdAt: new Date('2024-01-21T11:20:00'),
      status: 'completed',
      receiptNumber: 'RCP-001237',
    },
    {
      id: '5',
      items: [
        {
          product: {
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
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          quantity: 1,
          discount: 0,
        }
      ],
      subtotal: 199.99,
      tax: 16.00,
      discount: 0,
      total: 215.99,
      paymentMethod: 'cash',
      customerId: '5',
      cashierId: '1',
      createdAt: new Date('2024-01-20T09:10:00'),
      status: 'cancelled',
      receiptNumber: 'RCP-001238',
    },
  ];

  const filteredSales = mockSales.filter(sale => {
    const matchesSearch = sale.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customerId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;
    const matchesPaymentMethod = paymentMethodFilter === 'all' || sale.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const sortedSales = filteredSales.sort((a, b) => {
    let aValue: any = a[sortBy as keyof Sale];
    let bValue: any = b[sortBy as keyof Sale];
    
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalSales = mockSales.reduce((total, sale) => total + sale.total, 0);
  const totalTransactions = mockSales.length;
  const completedSales = mockSales.filter(sale => sale.status === 'completed');
  const pendingSales = mockSales.filter(sale => sale.status === 'pending');
  const cancelledSales = mockSales.filter(sale => sale.status === 'cancelled');
  const averageOrderValue = totalSales / totalTransactions;

  const getStatusIcon = (status: SaleStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: SaleStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  // Chart data for sales trends
  const salesChartData = [
    { date: '2024-01-15', sales: 2400, transactions: 12 },
    { date: '2024-01-16', sales: 1398, transactions: 8 },
    { date: '2024-01-17', sales: 9800, transactions: 25 },
    { date: '2024-01-18', sales: 3908, transactions: 18 },
    { date: '2024-01-19', sales: 4800, transactions: 22 },
    { date: '2024-01-20', sales: 3800, transactions: 19 },
    { date: '2024-01-21', sales: 4300, transactions: 21 },
    { date: '2024-01-22', sales: 5200, transactions: 24 },
  ];

  const SalesCard: React.FC<{ sale: Sale }> = ({ sale }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden card-hover"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">#{sale.receiptNumber}</h3>
            <p className="text-sm text-gray-500">
              {format(sale.createdAt, 'MMM dd, yyyy • h:mm a')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(sale.status)}`}>
              {getStatusIcon(sale.status)}
              <span className="capitalize">{sale.status}</span>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-lg font-bold text-gray-900">${sale.total.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payment Method</span>
            <div className="flex items-center space-x-1">
              {getPaymentMethodIcon(sale.paymentMethod)}
              <span className="text-sm font-medium capitalize">{sale.paymentMethod}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Items</span>
            <span className="text-sm font-medium">{sale.items.length} products</span>
          </div>

          {sale.discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Discount</span>
              <span className="text-sm font-medium text-green-600">-${sale.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <button
              onClick={() => {
                setSelectedSale(sale);
                setShowSaleDetails(true);
              }}
              className="w-full btn btn-secondary py-2 text-sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
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
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600">Track and manage your sales transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary px-4 py-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="btn btn-secondary px-4 py-2">
            <Download className="h-4 w-4 mr-2" />
            Export
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
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">${totalSales.toLocaleString()}</p>
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
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
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
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
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
            <div className="p-3 bg-orange-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedSales.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sales Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-soft border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">Last 7 days</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => format(new Date(value), 'MMM dd')}
              />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by receipt number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SaleStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value as PaymentMethod | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile">Mobile</option>
              <option value="other">Other</option>
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
                <option value="createdAt">Date</option>
                <option value="total">Amount</option>
                <option value="status">Status</option>
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

      {/* Sales Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedSales.map((sale) => (
          <SalesCard key={sale.id} sale={sale} />
        ))}
      </div>

      {sortedSales.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sales found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Sale Details Modal */}
      <AnimatePresence>
        {showSaleDetails && selectedSale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSaleDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sale Details</h3>
                <button
                  onClick={() => setShowSaleDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Sale Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900">#{selectedSale.receiptNumber}</h4>
                    <p className="text-sm text-gray-500">
                      {format(selectedSale.createdAt, 'MMM dd, yyyy • h:mm a')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(selectedSale.status)}`}>
                    {getStatusIcon(selectedSale.status)}
                    <span className="capitalize">{selectedSale.status}</span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Items</h5>
                  <div className="space-y-3">
                    {selectedSale.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h6 className="font-medium text-gray-900">{item.product.name}</h6>
                          <p className="text-sm text-gray-500">SKU: {item.product.sku}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">
                            ${item.product.price.toFixed(2)} × {item.quantity}
                          </div>
                          <div className="text-sm text-gray-500">
                            = ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">${selectedSale.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">${selectedSale.tax.toFixed(2)}</span>
                  </div>
                  {selectedSale.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium text-green-600">-${selectedSale.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${selectedSale.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">Payment Method</h6>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(selectedSale.paymentMethod)}
                      <span className="capitalize">{selectedSale.paymentMethod}</span>
                    </div>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">Cashier</h6>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>John Doe</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowSaleDetails(false)}
                    className="flex-1 btn btn-secondary py-2"
                  >
                    Close
                  </button>
                  <button className="flex-1 btn btn-primary py-2">
                    <Receipt className="h-4 w-4 mr-2" />
                    Print Receipt
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

export default Sales;