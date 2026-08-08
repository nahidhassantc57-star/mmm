import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, Category, Order } from './types';
import { CATEGORIES } from './data/products';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { DirectCheckoutModal } from './components/DirectCheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { AiHealthAdvisor } from './components/AiHealthAdvisor';
import { AdminPanel } from './components/AdminPanel';
import { OrderTrackModal } from './components/OrderTrackModal';
import { MessageSquare, PhoneCall, ShieldCheck, Heart, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State
  const [cartItems, setCartItems] = useState<Array<{ product: Product; selectedVariant?: ProductVariant; quantity: number }>>([]);

  // Modals Control
  const [isDirectCheckoutOpen, setIsDirectCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | undefined>(undefined);
  const [checkoutVariant, setCheckoutVariant] = useState<ProductVariant | undefined>(undefined);

  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  // Fetch products from server endpoint
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.data) {
        setProducts(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter Products based on category & search query
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.banglaName.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Handlers
  const handleOpenDirectCheckout = (product: Product, variant?: ProductVariant) => {
    setCheckoutProduct(product);
    setCheckoutVariant(variant);
    setIsDirectCheckoutOpen(true);
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, selectedVariant: variant, quantity: 1 }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedVariant?.id === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as any
    );
  };

  const handleRemoveCartItem = (productId: string, variantId?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedVariant?.id === variantId))
    );
  };

  const handleProceedCartToCheckout = () => {
    setIsCartOpen(false);
    setCheckoutProduct(undefined);
    setCheckoutVariant(undefined);
    setIsDirectCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setIsDirectCheckoutOpen(false);
    setCompletedOrder(order);
    setIsOrderSuccessOpen(true);
    setCartItems([]); // Clear cart
  };

  const handleAskAiAdvisor = (productName: string) => {
    setAiInitialQuery(`${productName} ব্যবহারের সঠিক নিয়ম ও স্বাস্থ্য উপকারিতা কি?`);
    setIsDetailsOpen(false);
    setIsAiAdvisorOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col antialiased selection:bg-amber-300 selection:text-emerald-950">
      {/* Main Header */}
      <Header
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAdvisor={() => {
          setAiInitialQuery('');
          setIsAiAdvisorOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      {/* Main Hero Promotional Section */}
      <HeroBanner
        onQuickCategoryClick={setSelectedCategory}
        onExpressOrderClick={() => {
          if (products.length > 0) {
            handleOpenDirectCheckout(products[0]);
          }
        }}
      />

      {/* Category Selection Filter Cards Bar */}
      <section className="max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-emerald-950 flex items-center gap-2">
              <span>পণ্য ক্যাটাগরি সমূহ</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              আপনার প্রয়োজনীয় প্রাকৃতির ও অর্গানিক পণ্য নির্বাচন করুন
            </p>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
              selectedCategory === 'all'
                ? 'bg-emerald-800 text-amber-300 border-emerald-800'
                : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            সব দেখুন ({products.length})
          </button>
        </div>

        {/* Category Cards Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between group relative overflow-hidden ${
                selectedCategory === cat.id
                  ? 'bg-emerald-900 text-white border-emerald-900 shadow-md ring-2 ring-amber-400'
                  : 'bg-white text-gray-800 border-emerald-100 hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              {cat.image && (
                <div className="w-full h-16 rounded-xl overflow-hidden mb-2 bg-emerald-50">
                  <img
                    src={cat.image}
                    alt={cat.banglaName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="font-extrabold text-xs sm:text-sm leading-tight">
                {cat.banglaName}
              </div>
              <div
                className={`text-[10px] mt-1 ${
                  selectedCategory === cat.id ? 'text-amber-300' : 'text-emerald-700 font-semibold'
                }`}
              >
                পণ্য দেখুন →
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Products Grid Section */}
      <section className="max-w-7xl mx-auto px-4 pb-12 w-full flex-1">
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-emerald-100 shadow-xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-4 border-b border-emerald-50">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>
                  {selectedCategory === 'all'
                    ? 'আমাদের ১০০% খাঁটি পণ্যসমূহ'
                    : CATEGORIES.find((c) => c.id === selectedCategory)?.banglaName}
                </span>
                <span className="text-xs bg-amber-400 text-emerald-950 font-extrabold px-2.5 py-0.5 rounded-full">
                  {filteredProducts.length} টি পণ্য
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                পছন্দের পণ্যের "অর্ডার করুন" বাটনে ক্লিক করে সরাসরি ১ ক্লিকে অর্ডার সম্পন্ন করুন।
              </p>
            </div>

            {searchQuery && (
              <div className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                সার্চ ফলাফল: <span className="font-bold">"{searchQuery}"</span>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-96 bg-emerald-50/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="text-4xl">🌱</div>
              <p className="font-extrabold text-gray-800 text-base">কোনো পণ্য পাওয়া যায়নি!</p>
              <p className="text-xs text-gray-500">
                অন্য কোনো নামে খুঁজুন অথবা সম্পূর্ণ পণ্য তালিকা দেখুন।
              </p>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="bg-emerald-800 text-amber-300 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                সকল পণ্য প্রদর্শন করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDirectCheckout={handleOpenDirectCheckout}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(p) => {
                    setDetailsProduct(p);
                    setIsDetailsOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/8801700000000?text=Hello%20Ghorer%20Bazar,%20I%20want%20to%20order"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center border-2 border-white group"
        title="WhatsApp Order & Support"
      >
        <span className="text-2xl">💬</span>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-black whitespace-nowrap pl-0 group-hover:pl-2 text-white">
          WhatsApp অর্ডার
        </span>
      </a>

      {/* Footer */}
      <footer className="bg-emerald-950 text-white pt-12 pb-6 border-t-4 border-amber-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <span className="text-2xl font-black tracking-tight">ঘরের বাজার</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              ঘরের বাজার - খাঁটি ও নিরাপদ খাবারের বিশ্বস্ত প্ল্যাটফর্ম। সুন্দরবনের প্রাকৃতিক মধু, ঘি, তেল, বাদাম ও প্রিমিয়াম ড্রাই ফ্রুটস সেরা কোয়ালিটিতে আপনার দরজায় পৌঁছে দিতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-amber-300 text-sm mb-3">গুরুত্বপূর্ণ লিংক</h3>
            <ul className="space-y-2 text-xs text-emerald-100">
              <li>
                <button onClick={() => setSelectedCategory('honey')} className="hover:text-amber-300">
                  খাঁটি মধু সংগ্রহ
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('ghee-oil')} className="hover:text-amber-300">
                  গাওয়া ঘি ও তেল
                </button>
              </li>
              <li>
                <button onClick={() => setSelectedCategory('dates-dryfruits')} className="hover:text-amber-300">
                  আজওয়া খেজুর ও ড্রাই ফ্রুটস
                </button>
              </li>
              <li>
                <button onClick={() => setIsTrackOrderOpen(true)} className="hover:text-amber-300">
                  অর্ডার ট্র্যাকিং
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-amber-300 text-sm mb-3">গ্রাহক সেবা & সহায়তা</h3>
            <ul className="space-y-2 text-xs text-emerald-100">
              <li>📞 হটলাইন: 01700-000000</li>
              <li>💬 হোয়াটসঅ্যাপ: 01700-000000</li>
              <li>📍 ঠিকানা: ধানমন্ডি, ঢাকা - ১২০৯</li>
              <li>🚚 ক্যাশ অন ডেলিভারি সার্ভিস</li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold text-amber-300 text-sm mb-3">আমাদের প্রতিশ্রুতি</h3>
            <div className="bg-emerald-900/80 p-3 rounded-2xl border border-emerald-800 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>১০০% ভেজালমুক্ত উপাদান</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>ডেলিভারি পেয়ে কোয়ালিটি চেক</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>পছন্দ না হলে ক্যাশ রিটার্ন</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-emerald-900 text-center text-xs text-emerald-400">
          © {new Date().getFullYear()} Ghorer Bazar Organic Store. All Rights Reserved.
        </div>
      </footer>

      {/* --- ALL MODALS & DRAWERS --- */}

      {/* Direct Checkout Modal (1-Click Order) */}
      <DirectCheckoutModal
        isOpen={isDirectCheckoutOpen}
        onClose={() => setIsDirectCheckoutOpen(false)}
        product={checkoutProduct}
        selectedVariant={checkoutVariant}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Invoice Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={detailsProduct}
        onClose={() => setIsDetailsOpen(false)}
        onDirectCheckout={handleOpenDirectCheckout}
        onAddToCart={handleAddToCart}
        onAskAiAdvisor={handleAskAiAdvisor}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedCartToCheckout}
      />

      {/* AI Health & Nutrition Advisor Drawer */}
      <AiHealthAdvisor
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        initialQuery={aiInitialQuery}
      />

      {/* Store Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductAdded={fetchProducts}
      />

      {/* Order Tracker Modal */}
      <OrderTrackModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />
    </div>
  );
}
