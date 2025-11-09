import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Smartphone,
  Receipt,
  X,
  Barcode,
  User,
  Percent,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, CartItem, PaymentMethod } from '../types';
import toast from 'react-hot-toast';

const POS: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);
  const [quickAdd, setQuickAdd] = useState('');

  const settings = useMemo(() => {
    try {
      const raw = localStorage.getItem('settings');
      return raw ? JSON.parse(raw) as { shopName?: string; taxPercent?: string; receiptFooter?: string } : {};
    } catch (_e) {
      return {} as any;
    }
  }, []);

  // Mock products data
  const mockProducts: Product[] = [
    {
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
    {
      id: '2',
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
    {
      id: '3',
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
    {
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
    {
      id: '5',
      name: 'Adidas Ultraboost 22',
      description: 'High-performance running shoes',
      price: 180.00,
      cost: 120.00,
      category: 'Shoes',
      sku: 'AUB22-001',
      barcode: '1234567890127',
      stock: 22,
      minStock: 8,
      maxStock: 45,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category)))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.stock > 0;
  });

  const addToCart = (product: Product) => {
    const existingItem = state.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error('Not enough stock available');
        return;
      }
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { productId: product.id, quantity: existingItem.quantity + 1 }
      });
    } else {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          product: product,
          quantity: 1
        }
      });
    }
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { productId, quantity }
      });
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    toast.success('Item removed from cart');
  };

  const calculateSubtotal = () => {
    return state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    const pct = parseFloat(settings.taxPercent || '8');
    return calculateSubtotal() * (isNaN(pct) ? 0.08 : pct / 100);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    const discountPercent = parseFloat(discount) || 0;
    return (subtotal * discountPercent) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const processPayment = () => {
    if (state.cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const total = calculateTotal();
    const received = parseFloat(amountReceived) || 0;

    if (paymentMethod === 'cash' && received < total) {
      toast.error('Insufficient amount received');
      return;
    }

    // Create sale record
    const sale = {
      id: Date.now().toString(),
      items: state.cart,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      discount: calculateDiscount(),
      total: total,
      paymentMethod: paymentMethod,
      customerId: customerName || undefined,
      cashierId: state.currentUser?.id || '1',
      createdAt: new Date(),
      status: 'completed' as const,
      receiptNumber: `RCP-${Date.now()}`,
    };

    dispatch({ type: 'ADD_SALE', payload: sale });
    dispatch({ type: 'CLEAR_CART' });
    setLastSaleId(sale.id);
    
    setShowPaymentModal(false);
    setAmountReceived('');
    setCustomerName('');
    setDiscount('');
    
    setShowReceipt(true);
    toast.success('Payment processed successfully!');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="w-80 relative">
              <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Quick add by SKU or barcode"
                value={quickAdd}
                onChange={(e) => setQuickAdd(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const match = mockProducts.find(p => p.barcode === quickAdd || p.sku.toLowerCase() === quickAdd.toLowerCase());
                    if (match) {
                      addToCart(match);
                      setQuickAdd('');
                    } else {
                      toast.error('No product found for code');
                    }
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex space-x-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-lg shadow-soft border border-gray-100 p-4 cursor-pointer hover:shadow-medium transition-all"
                onClick={() => addToCart(product)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart ({state.cart.length})
            </h2>
            {state.cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {state.cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-gray-50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Summary */}
        {state.cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%):</span>
                <span className="font-medium">${calculateTax().toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-medium text-green-600">-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Discount %"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="btn btn-primary px-6 py-2 text-sm"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-96 max-w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'cash', label: 'Cash', icon: DollarSign },
                      { value: 'card', label: 'Card', icon: CreditCard },
                      { value: 'mobile', label: 'Mobile', icon: Smartphone },
                      { value: 'other', label: 'Other', icon: Receipt },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.value}
                          onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                          className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 ${
                            paymentMethod === method.value
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm font-medium">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {paymentMethod === 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {amountReceived && (
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span>Change:</span>
                          <span className="font-medium">
                            ${(parseFloat(amountReceived) - calculateTotal()).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Amount:</span>
                      <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
                    </div>
                    {paymentMethod === 'cash' && amountReceived && (
                      <div className="flex justify-between text-sm">
                        <span>Amount Received:</span>
                        <span>${parseFloat(amountReceived).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 btn btn-secondary py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processPayment}
                    className="flex-1 btn btn-primary py-2"
                  >
                    Process Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceipt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowReceipt(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-[420px] max-w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Receipt Preview</h3>
                <button onClick={() => setShowReceipt(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div ref={receiptRef} className="text-sm text-gray-800">
                <div className="text-center border-b pb-3 mb-3">
                  <div className="font-bold text-gray-900">{settings.shopName || 'Shop Market'}</div>
                  <div className="text-xs text-gray-500">Receipt #{lastSaleId}</div>
                  <div className="text-xs text-gray-500">{new Date().toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  {state.sales.find(s => s.id === lastSaleId)?.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3 space-y-1">
                  <div className="flex justify-between"><span>Subtotal</span><span>${calculateSubtotal().toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Tax</span><span>${calculateTax().toFixed(2)}</span></div>
                  {discount && <div className="flex justify-between"><span>Discount</span><span>-${calculateDiscount().toFixed(2)}</span></div>}
                  <div className="flex justify-between font-semibold"><span>Total</span><span>${calculateTotal().toFixed(2)}</span></div>
                </div>
                {settings.receiptFooter && (
                  <div className="text-center text-xs text-gray-500 mt-4">
                    {settings.receiptFooter}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowReceipt(false)} className="flex-1 btn btn-secondary py-2">Close</button>
                <button
                  onClick={() => {
                    const win = window.open('', 'PRINT', 'height=600,width=400');
                    if (!win) return;
                    win.document.write('<html><head><title>Receipt</title>');
                    win.document.write('<style>body{font-family:ui-sans-serif,system-ui,-apple-system; padding:16px} .row{display:flex;justify-content:space-between}</style>');
                    win.document.write('</head><body>');
                    win.document.write(receiptRef.current?.innerHTML || '');
                    win.document.write('</body></html>');
                    win.document.close();
                    win.focus();
                    win.print();
                    win.close();
                  }}
                  className="flex-1 btn btn-primary py-2"
                >
                  Print
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default POS;
