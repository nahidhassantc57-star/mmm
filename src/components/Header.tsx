import React, { useState } from 'react';
import { ShoppingBag, Phone, Search, Sparkles, ShieldCheck, Menu, X, Bot, LayoutDashboard, Truck } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiAdvisor: () => void;
  onOpenAdmin: () => void;
  onOpenTrackOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenAiAdvisor,
  onOpenAdmin,
  onOpenTrackOrder
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-700">
      {/* Top Banner Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>১০০% খাঁটি ও প্রাকৃতির নিশ্চয়তা | সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenTrackOrder}
              className="hover:text-amber-300 transition flex items-center gap-1 underline underline-offset-2"
            >
              <Truck className="w-3.5 h-3.5" />
              অর্ডার ট্র্যাকিং
            </button>
            <span className="text-emerald-700">|</span>
            <a
              href="https://wa.me/8801700000000?text=Hello%20Ghorer%20Bazar,%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noreferrer"
              className="text-amber-300 font-bold hover:underline flex items-center gap-1"
            >
              💬 WhatsApp: 01700-000000
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 sm:gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-emerald-100 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 font-black text-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                ঘরের বাজার
              </span>
              <span className="text-[10px] sm:text-xs text-amber-300 font-semibold tracking-wider">
                Ghorer Bazar Organic
              </span>
            </div>
          </a>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-lg relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="পছন্দের খাঁটি খাবার খুঁজুন (যেমন: মধু, ঘি, তেল, বাদাম)..."
            className="w-full bg-emerald-950/60 text-white placeholder-emerald-300/70 border border-emerald-600 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          <Search className="w-4 h-4 text-emerald-300 absolute left-3.5 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-emerald-300 hover:text-white"
            >
              মুছে ফেলুন
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="hidden sm:flex items-center gap-1.5 bg-emerald-700/80 hover:bg-emerald-600 text-amber-300 font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-xs border border-emerald-500/50 transition shadow-xs"
            title="অর্গানিক হেলথ এডভাইজর"
          >
            <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>অর্গানিক AI</span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1 text-emerald-100 hover:text-white bg-emerald-950/80 hover:bg-emerald-950 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-emerald-700/80 transition shadow-xs"
            title="এডমিন প্যানেল"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">এডমিন প্যানেল</span>
            <span className="sm:hidden text-[11px]">এডমিন</span>
          </button>

          {/* Hotline Contact */}
          <a
            href="tel:01700000000"
            className="hidden sm:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold px-3.5 py-1.5 rounded-full text-xs shadow-md transition transform active:scale-95"
          >
            <Phone className="w-3.5 h-3.5 fill-current" />
            <span>01700-000000</span>
          </a>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative bg-emerald-900 hover:bg-emerald-950 text-white p-2.5 rounded-xl border border-emerald-600/60 shadow-md transition flex items-center justify-center active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-emerald-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-800 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="পছন্দের খাঁটি খাবার খুঁজুন (মধু, ঘি, তেল, বাদাম)..."
            className="w-full bg-emerald-950/70 text-white placeholder-emerald-300/70 border border-emerald-600 rounded-full pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-emerald-300 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-emerald-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Categories Bar - Desktop */}
      <nav className="hidden md:block bg-emerald-900/90 border-t border-emerald-700/60 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
              }`}
            >
              <span>{cat.banglaName}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-700 px-4 py-3 space-y-3">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">ক্যাটাগরি সমূহ:</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`p-2 rounded-lg text-xs font-bold text-left transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-400 text-emerald-950 font-black'
                    : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-800'
                }`}
              >
                {cat.banglaName}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-emerald-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAiAdvisor();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-800 text-amber-300 hover:bg-emerald-700 p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-emerald-600"
            >
              <Bot className="w-4 h-4" />
              <span>অর্গানিক AI স্বাস্থ্য পরামর্শ পান</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-950 text-emerald-200 p-2 rounded-lg text-xs font-medium text-center"
            >
              এডমিন প্যানেলে যান
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
