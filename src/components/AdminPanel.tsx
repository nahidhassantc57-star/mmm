import React, { useState, useEffect } from 'react';
import { Order, Product } from '../types';
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  CheckCircle,
  Clock,
  Truck,
  FileText,
  Filter,
  RefreshCw,
  Search,
  Printer,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Check,
  Edit2,
  Tag
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onProductAdded }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'add_product'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Orders Tab Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Selected Order for Invoice Memo Modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Inventory Search
  const [inventorySearch, setInventorySearch] = useState<string>('');

  // Add Product Form state
  const [prodName, setProdName] = useState('');
  const [prodBanglaName, setProdBanglaName] = useState('');
  const [prodCategoryId, setProdCategoryId] = useState('honey');
  const [prodPrice, setProdPrice] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodBenefits, setProdBenefits] = useState('১০০% প্রাকৃতিক ও ভেজালমুক্ত, সরাসরি সংগৃহীত, পুষ্টিগুণে ভরপুর');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success && data.data) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Products
  const fetchProductsList = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProductsList();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev =>
          prev.map(o => (o.id === orderId || o.invoiceNo === orderId ? { ...o, status: newStatus as any } : o))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStock = async (productId: string, currentStock: boolean) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !currentStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, inStock: !currentStock } : p))
        );
        onProductAdded();
      }
    } catch (e) {
      alert('স্টক আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) return;
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        onProductAdded();
      }
    } catch (e) {
      alert('পণ্য মোছা সম্ভব হয়নি');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodBanglaName || !prodPrice) return;

    setIsSubmittingProduct(true);
    try {
      const benefitsArray = prodBenefits
        .split(',')
        .map(b => b.trim())
        .filter(Boolean);

      const payload = {
        name: prodName,
        banglaName: prodBanglaName,
        categoryId: prodCategoryId,
        price: Number(prodPrice),
        salePrice: prodSalePrice ? Number(prodSalePrice) : undefined,
        shortDescription: prodDescription || '১০০% প্রাকৃতির ও অর্গানিক খাঁটি খাবার।',
        description: prodDescription || 'আমাদের ঘরের বাজার থেকে সংগৃহীত সেরা মানের উপাদান।',
        image:
          prodImage ||
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
        inStock: true,
        isFeatured: true,
        benefits: benefitsArray
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        alert('নতুন পণ্যটি সফলভাবে যুক্ত হয়েছে!');
        setProdName('');
        setProdBanglaName('');
        setProdPrice('');
        setProdSalePrice('');
        setProdDescription('');
        setProdImage('');
        fetchProductsList();
        onProductAdded();
        setActiveTab('inventory');
      }
    } catch (e) {
      alert('পণ্য যোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      o.invoiceNo.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.customerAddress.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  // Filtered Inventory
  const filteredProducts = products.filter(p => {
    const q = inventorySearch.toLowerCase().trim();
    return !q || p.name.toLowerCase().includes(q) || p.banglaName.toLowerCase().includes(q);
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[94vh] flex flex-col my-auto">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-xl shadow-sm">
              👑
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-amber-300">
                ঘরের বাজার অ্যাডমিন কন্ট্রোল সেন্টার
              </h2>
              <p className="text-xs text-emerald-300">
                অর্ডার প্রসেসিং, সেলস অ্যানালিটিক্স ও ইনভেন্টরি ম্যানেজমেন্ট
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-emerald-900 border-b border-emerald-800 px-4 flex gap-1 sm:gap-3 overflow-x-auto no-scrollbar shrink-0 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white text-emerald-950 border-t-2 border-amber-400 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>ওভারভিউ & ড্যাশবোর্ড</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-white text-emerald-950 border-t-2 border-amber-400 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>অর্ডার তালিকা ({orders.length})</span>
            {pendingCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-white text-emerald-950 border-t-2 border-amber-400 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>পণ্য ইনভেন্টরি ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add_product')}
            className={`px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition whitespace-nowrap ${
              activeTab === 'add_product'
                ? 'bg-white text-emerald-950 border-t-2 border-amber-400 shadow-sm'
                : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>নতুন পণ্য যোগ</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50/60">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Metric Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-bold">মোট বিক্রয় (BDT)</div>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      ৳{totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      গড় অর্ডার: ৳{avgOrderValue.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    ৳
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-bold">মোট অর্ডার সংখ্যা</div>
                    <div className="text-2xl font-black text-gray-900 mt-1">{orders.length} টি</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ডেলিভারি সম্পন্ন: {deliveredCount} টি
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-bold">পেন্ডিং প্রসেসিং</div>
                    <div className="text-2xl font-black text-rose-600 mt-1">{pendingCount} টি</div>
                    <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                      কল কনফার্মেশন দরকার
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-bold">ইনভেন্টরি পণ্য</div>
                    <div className="text-2xl font-black text-emerald-950 mt-1">{products.length} টি</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ইন স্টক: {products.filter(p => p.inStock).length} টি
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Order Status Visual Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
                <h3 className="font-extrabold text-gray-900 text-sm">অর্ডার স্ট্যাটাস পাইপলাইন</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <div className="text-xs text-amber-800 font-bold">পেন্ডিং (Pending)</div>
                    <div className="text-xl font-black text-amber-900">{pendingCount}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                    <div className="text-xs text-blue-800 font-bold">প্রসেসিং (Processing)</div>
                    <div className="text-xl font-black text-blue-900">{processingCount}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <div className="text-xs text-purple-800 font-bold">কুরিয়ারে (Shipped)</div>
                    <div className="text-xl font-black text-purple-900">{shippedCount}</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    <div className="text-xs text-emerald-800 font-bold">সম্পন্ন (Delivered)</div>
                    <div className="text-xl font-black text-emerald-900">{deliveredCount}</div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Quick Overview */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-gray-900 text-sm">সর্বশেষ অর্ডারসমূহ</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    সকল অর্ডার দেখুন →
                  </button>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  {orders.slice(0, 5).map(ord => (
                    <div key={ord.id} className="py-2.5 flex justify-between items-center gap-2">
                      <div>
                        <span className="font-mono font-bold text-emerald-900 mr-2">
                          {ord.invoiceNo}
                        </span>
                        <span className="font-bold text-gray-800">{ord.customerName}</span>
                        <span className="text-gray-400 text-[11px] ml-2">({ord.customerPhone})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-emerald-900">৳{ord.grandTotal}</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST & MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
                {/* Search Field */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    placeholder="ইনভয়েস নো, গ্রাহকের নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-emerald-700 shrink-0" />
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none"
                  >
                    <option value="all">সকল ফিল্টার (All)</option>
                    <option value="pending">পেন্ডিং (Pending)</option>
                    <option value="processing">প্রসেসিং (Processing)</option>
                    <option value="shipped">শিপড (Shipped)</option>
                    <option value="delivered">সম্পন্ন (Delivered)</option>
                    <option value="cancelled">বাতিল (Cancelled)</option>
                  </select>

                  <button
                    onClick={fetchOrders}
                    className="bg-emerald-800 text-amber-300 hover:bg-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              {loadingOrders ? (
                <div className="p-12 text-center text-xs text-gray-500">অর্ডার সমূহ লোড হচ্ছে...</div>
              ) : filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-500 bg-white rounded-2xl border border-gray-200">
                  কোনো অর্ডার পাওয়া যায়নি।
                </div>
              ) : (
                <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-emerald-950 text-white font-bold text-[11px] uppercase">
                        <tr>
                          <th className="p-3.5">ইনভয়েস</th>
                          <th className="p-3.5">গ্রাহকের নাম & মোবাইল</th>
                          <th className="p-3.5">ঠিকানা & এরিয়া</th>
                          <th className="p-3.5">অর্ডার আইটেম</th>
                          <th className="p-3.5">মোট বিল</th>
                          <th className="p-3.5">স্ট্যাটাস</th>
                          <th className="p-3.5 text-center">মেমো প্রিন্ট</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {filteredOrders.map(ord => (
                          <tr key={ord.id} className="hover:bg-amber-50/40 transition">
                            <td className="p-3.5 font-mono font-bold text-emerald-900">
                              {ord.invoiceNo}
                              <div className="text-[10px] text-gray-400 font-sans">
                                {new Date(ord.createdAt).toLocaleDateString('bn-BD')}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-extrabold text-gray-900">{ord.customerName}</div>
                              <a
                                href={`tel:${ord.customerPhone}`}
                                className="text-emerald-700 font-bold hover:underline text-[11px]"
                              >
                                📞 {ord.customerPhone}
                              </a>
                            </td>
                            <td className="p-3.5 max-w-xs">
                              <div className="text-gray-800 leading-snug">{ord.customerAddress}</div>
                              <div className="text-[10px] text-amber-700 font-bold mt-0.5">
                                {ord.deliveryZone === 'inside_dhaka'
                                  ? 'ঢাকা (চার্জ ৳৭০)'
                                  : 'ঢাকার বাইরে (চার্জ ৳১৩০)'}
                              </div>
                            </td>
                            <td className="p-3.5 max-w-xs">
                              {ord.items.map((it, i) => (
                                <div key={i} className="text-[11px] text-gray-700 font-medium">
                                  • {it.productName} ({it.variantName}) x{it.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="p-3.5 font-black text-emerald-950 text-sm">
                              ৳{ord.grandTotal.toLocaleString()}
                            </td>
                            <td className="p-3.5">
                              <select
                                value={ord.status}
                                onChange={e => handleUpdateStatus(ord.id, e.target.value)}
                                className={`border rounded-lg px-2 py-1 text-[11px] font-extrabold cursor-pointer focus:outline-none ${
                                  ord.status === 'pending'
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : ord.status === 'processing'
                                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                                    : ord.status === 'shipped'
                                    ? 'bg-purple-50 text-purple-800 border-purple-300'
                                    : ord.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                <option value="pending">পেন্ডিং (Pending)</option>
                                <option value="processing">প্রসেসিং (Processing)</option>
                                <option value="shipped">শিপড (Shipped)</option>
                                <option value="delivered">সম্পন্ন (Delivered)</option>
                                <option value="cancelled">বাতিল (Cancelled)</option>
                              </select>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                onClick={() => setSelectedInvoiceOrder(ord)}
                                className="bg-emerald-900 text-amber-300 hover:bg-emerald-950 px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-xs"
                                title="প্রিন্ট বা ইনভয়েস মেমো দেখুন"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>মেমো</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCT INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex justify-between items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={e => setInventorySearch(e.target.value)}
                    placeholder="ইনভেন্টরি পণ্য সার্চ করুন..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>

                <button
                  onClick={() => setActiveTab('add_product')}
                  className="bg-emerald-800 text-amber-300 hover:bg-emerald-900 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>নতুন পণ্য যোগ</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-emerald-950 text-white font-bold text-[11px] uppercase">
                      <tr>
                        <th className="p-3.5">ছবি & নাম</th>
                        <th className="p-3.5">ক্যাটাগরি</th>
                        <th className="p-3.5">মূল্য (BDT)</th>
                        <th className="p-3.5">অফার মূল্য</th>
                        <th className="p-3.5">স্টক স্ট্যাটাস</th>
                        <th className="p-3.5 text-center">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-amber-50/30 transition">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.banglaName}
                              className="w-12 h-12 rounded-xl object-cover border border-emerald-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-extrabold text-gray-900 text-xs sm:text-sm">
                                {p.banglaName}
                              </div>
                              <div className="text-[11px] text-gray-400">{p.name}</div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg text-[11px]">
                              {p.categoryId}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-gray-800">৳{p.price}</td>
                          <td className="p-3.5 font-bold text-amber-600">
                            {p.salePrice ? `৳${p.salePrice}` : '-'}
                          </td>
                          <td className="p-3.5">
                            <button
                              onClick={() => handleToggleStock(p.id, p.inStock)}
                              className={`px-3 py-1 rounded-full text-[11px] font-black transition ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {p.inStock ? '✓ স্টক আছে (In Stock)' : '✕ স্টক নেই (Out of Stock)'}
                            </button>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                              title="পণ্যটি মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADD NEW PRODUCT FORM */}
          {activeTab === 'add_product' && (
            <form
              onSubmit={handleAddProduct}
              className="max-w-2xl mx-auto space-y-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b pb-3 border-emerald-100">
                <PlusCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-emerald-950 text-base">
                  নতুন অর্গানিক খাদ্যপণ্য যোগ করুন
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ইংলিশ নাম (English Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    placeholder="e.g., Pure Kholisha Honey"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বাংলা নাম (Bangla Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodBanglaName}
                    onChange={e => setProdBanglaName(e.target.value)}
                    placeholder="যেমন: সুন্দরবনের খাঁটি খলিসা মধু"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={prodCategoryId}
                    onChange={e => setProdCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none"
                  >
                    <option value="honey">খাঁটি মধু</option>
                    <option value="ghee-oil">গাওয়া ঘি ও তেল</option>
                    <option value="nuts-seeds">বাদাম ও বীজ</option>
                    <option value="dates-dryfruits">আজওয়া খেজুর & ড্রাই ফ্রুটস</option>
                    <option value="combos">কম্বো অফার</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    মূল্য / BDT Price *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={e => setProdPrice(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    অফার মূল্য / Discount Price (ঐচ্ছিক)
                  </label>
                  <input
                    type="number"
                    value={prodSalePrice}
                    onChange={e => setProdSalePrice(e.target.value)}
                    placeholder="850"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ছবি লিংক (Image URL - Unsplash or Direct Image)
                </label>
                <input
                  type="url"
                  value={prodImage}
                  onChange={e => setProdImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  স্বাস্থ্য উপকারিতা কমা (,) দিয়ে আলাদা করুন
                </label>
                <input
                  type="text"
                  value={prodBenefits}
                  onChange={e => setProdBenefits(e.target.value)}
                  placeholder="১০০% প্রাকৃতির, ভেজালমুক্ত, সরাসরি সুন্দরবন থেকে সংগৃহীত"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  পণ্যের পূর্ণাঙ্গ বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={prodDescription}
                  onChange={e => setProdDescription(e.target.value)}
                  placeholder="পণ্যটির উৎস, গুনাগুণ ও ব্যবহারবিধি লিখুন..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs focus:bg-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingProduct}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-md transition"
              >
                {isSubmittingProduct ? 'পণ্য সেভ হচ্ছে...' : 'পণ্য টি যোগ করুন'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* INVOICE PRINT MEMO MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-emerald-200 space-y-4 my-auto relative">
            <button
              onClick={() => setSelectedInvoiceOrder(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Memo Area */}
            <div id="printable-memo" className="p-4 border border-gray-300 rounded-xl space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-300 pb-3">
                <div>
                  <h1 className="text-xl font-black text-emerald-950">🌱 ঘরের বাজার</h1>
                  <p className="text-[10px] text-gray-500 font-bold">
                    Ghorer Bazar Organic Store (Cash On Delivery)
                  </p>
                  <p className="text-[10px] text-gray-500">ধানমন্ডি, ঢাকা | হটলাইন: 01700-000000</p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-black text-emerald-900 text-xs">
                    {selectedInvoiceOrder.invoiceNo}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    তারিখ:{' '}
                    {new Date(selectedInvoiceOrder.createdAt).toLocaleDateString('bn-BD')}
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-xs space-y-1">
                <div>
                  <span className="font-bold">গ্রাহকের নাম:</span> {selectedInvoiceOrder.customerName}
                </div>
                <div>
                  <span className="font-bold">ফোন:</span> {selectedInvoiceOrder.customerPhone}
                </div>
                <div>
                  <span className="font-bold">ঠিকানা:</span> {selectedInvoiceOrder.customerAddress}
                </div>
                <div>
                  <span className="font-bold">ডেলিভারি এলাকা:</span>{' '}
                  {selectedInvoiceOrder.deliveryZone === 'inside_dhaka'
                    ? 'ঢাকার ভেতরে'
                    : 'ঢাকার বাইরে'}
                </div>
              </div>

              {/* Items List */}
              <table className="w-full text-xs text-left border border-gray-200">
                <thead className="bg-gray-100 font-bold border-b">
                  <tr>
                    <th className="p-1.5">পণ্য</th>
                    <th className="p-1.5 text-center">পরিমাণ</th>
                    <th className="p-1.5 text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 font-bold">
                        {it.productName} ({it.variantName})
                      </td>
                      <td className="p-1.5 text-center">{it.quantity}</td>
                      <td className="p-1.5 text-right font-mono">৳{it.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div className="space-y-1 text-xs border-t border-gray-300 pt-2">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono">৳{selectedInvoiceOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-mono">৳{selectedInvoiceOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-emerald-950 border-t pt-1">
                  <span>সর্বমোট প্রদেয় (ক্যাশ অন ডেলিভারি):</span>
                  <span className="text-amber-700 font-mono text-base">
                    ৳{selectedInvoiceOrder.grandTotal}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-emerald-800 text-amber-300 font-bold py-2.5 rounded-xl text-xs hover:bg-emerald-900 transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>মেমো প্রিন্ট করুন</span>
              </button>

              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-gray-200"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
