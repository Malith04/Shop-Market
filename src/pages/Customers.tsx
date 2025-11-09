import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Calendar,
  MoreVertical,
  UserPlus,
  UserCheck,
  UserX,
  Crown,
  Gift,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Customers: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  // Mock customers data
  const mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      loyaltyPoints: 1250,
      totalSpent: 2847.50,
      createdAt: new Date('2023-12-15'),
      lastVisit: new Date('2024-01-20'),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 234-5678',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      loyaltyPoints: 850,
      totalSpent: 1923.75,
      createdAt: new Date('2023-11-20'),
      lastVisit: new Date('2024-01-18'),
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 345-6789',
      address: '789 Pine St, Chicago, IL 60601',
      loyaltyPoints: 2100,
      totalSpent: 4567.25,
      createdAt: new Date('2023-10-10'),
      lastVisit: new Date('2024-01-22'),
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 456-7890',
      address: '321 Elm St, Houston, TX 77001',
      loyaltyPoints: 450,
      totalSpent: 987.50,
      createdAt: new Date('2024-01-05'),
      lastVisit: new Date('2024-01-19'),
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 567-8901',
      address: '654 Maple Ave, Phoenix, AZ 85001',
      loyaltyPoints: 3200,
      totalSpent: 6789.00,
      createdAt: new Date('2023-09-15'),
      lastVisit: new Date('2024-01-21'),
    },
    {
      id: '6',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 678-9012',
      address: '987 Cedar St, Philadelphia, PA 19101',
      loyaltyPoints: 180,
      totalSpent: 456.25,
      createdAt: new Date('2024-01-10'),
      lastVisit: new Date('2024-01-17'),
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    return matchesSearch;
  });

  const sortedCustomers = filteredCustomers.sort((a, b) => {
    let aValue: any = a[sortBy as keyof Customer];
    let bValue: any = b[sortBy as keyof Customer];
    
    if (sortBy === 'createdAt' || sortBy === 'lastVisit') {
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

  const totalCustomers = mockCustomers.length;
  const totalLoyaltyPoints = mockCustomers.reduce((total, customer) => total + customer.loyaltyPoints, 0);
  const totalRevenue = mockCustomers.reduce((total, customer) => total + customer.totalSpent, 0);
  const averageOrderValue = totalRevenue / mockCustomers.length;

  const getCustomerTier = (loyaltyPoints: number) => {
    if (loyaltyPoints >= 3000) return { tier: 'VIP', color: 'text-purple-600', bg: 'bg-purple-100', icon: Crown };
    if (loyaltyPoints >= 1500) return { tier: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Award };
    if (loyaltyPoints >= 500) return { tier: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100', icon: Star };
    return { tier: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-100', icon: Gift };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCustomer) {
      // Update existing customer
      const updatedCustomer: Customer = {
        ...editingCustomer,
        ...formData,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_CUSTOMER', payload: updatedCustomer });
      toast.success('Customer updated successfully');
    } else {
      // Add new customer
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        loyaltyPoints: 0,
        totalSpent: 0,
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
      toast.success('Customer added successfully');
    }
    
    setShowAddModal(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    });
    setShowAddModal(true);
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      // dispatch({ type: 'DELETE_CUSTOMER', payload: customerId });
      toast.success('Customer deleted successfully');
    }
  };

  const CustomerCard: React.FC<{ customer: Customer }> = ({ customer }) => {
    const tier = getCustomerTier(customer.loyaltyPoints);
    const Icon = tier.icon;

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
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${tier.bg} ${tier.color}`}>
              <Icon className="h-3 w-3" />
              <span>{tier.tier}</span>
            </div>
          </div>

          <div className="space-y-3">
            {customer.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {customer.phone}
              </div>
            )}
            
            {customer.address && (
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{customer.address}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <div className="text-xs text-gray-500">Loyalty Points</div>
                <div className="font-semibold text-gray-900">{customer.loyaltyPoints.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Total Spent</div>
                <div className="font-semibold text-gray-900">${customer.totalSpent.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowCustomerDetails(true);
                }}
                className="flex-1 btn btn-secondary py-2 text-sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </button>
              <button
                onClick={() => handleEdit(customer)}
                className="flex-1 btn btn-primary py-2 text-sm"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">Manage your customer database and loyalty program</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn btn-secondary px-4 py-2">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
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
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
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
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900">{totalLoyaltyPoints.toLocaleString()}</p>
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
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
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
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
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
                <option value="loyaltyPoints">Loyalty Points</option>
                <option value="totalSpent">Total Spent</option>
                <option value="createdAt">Date Joined</option>
                <option value="lastVisit">Last Visit</option>
            </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCustomers.map((customer) => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>

      {sortedCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96 max-w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <UserX className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter address"
                  />
              </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 btn btn-secondary py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn btn-primary py-2"
                  >
                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customer Details Modal */}
      <AnimatePresence>
        {showCustomerDetails && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowCustomerDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96 max-w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <UserX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {selectedCustomer.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h4>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    getCustomerTier(selectedCustomer.loyaltyPoints).bg
                  } ${
                    getCustomerTier(selectedCustomer.loyaltyPoints).color
                  }`}>
                    <Crown className="h-4 w-4 mr-1" />
                    {getCustomerTier(selectedCustomer.loyaltyPoints).tier} Member
              </div>
            </div>

            <div className="space-y-3">
                  {selectedCustomer.email && (
              <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-3" />
                      {selectedCustomer.email}
              </div>
                  )}
                  
                  {selectedCustomer.phone && (
              <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-3" />
                      {selectedCustomer.phone}
                    </div>
                  )}
                  
                  {selectedCustomer.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0" />
                      {selectedCustomer.address}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedCustomer.loyaltyPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Loyalty Points</div>
              </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">${selectedCustomer.totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {format(selectedCustomer.createdAt, 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">Member Since</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {selectedCustomer.lastVisit ? format(selectedCustomer.lastVisit, 'MMM dd, yyyy') : 'Never'}
                    </div>
                    <div className="text-sm text-gray-500">Last Visit</div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowCustomerDetails(false);
                      handleEdit(selectedCustomer);
                    }}
                    className="flex-1 btn btn-primary py-2"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Customer
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

export default Customers;