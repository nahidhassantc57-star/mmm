import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { Star, ShoppingBag, Zap, Eye, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDirectCheckout: (product: Product, selectedVariant?: ProductVariant) => void;
  onAddToCart: (product: Product, selectedVariant?: ProductVariant) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onDirectCheckout,
  onAddToCart,
  onViewDetails,
}) => {
  // Default selected variant is the first variant or undefined
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  const [addedToast, setAddedToast] = useState(false);

  // Price calculations
  const currentPrice = selectedVariant
    ? selectedVariant.salePrice ?? selectedVariant.price
    : product.salePrice ?? product.price;

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = currentPrice < originalPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedVariant);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleDirectCheckout = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectCheckout(product, selectedVariant);
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer relative"
    >
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square overflow-hidden bg-emerald-50/50">
        <img
          src={product.image}
          alt={product.banglaName || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-amber-400 text-emerald-950 font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              হট সেলিং
            </span>
          )}
          {hasDiscount && (
            <span className="bg-rose-600 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-full shadow-md">
              {discountPercent}% ছাড়
            </span>
          )}
        </div>

        {/* Quick View Floating Overlay */}
        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 backdrop-blur text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> বিস্তারিত দেখুন
          </span>
        </div>

        {/* Stock Status */}
        <div className="absolute bottom-2 right-2 bg-emerald-900/80 backdrop-blur text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-amber-400" />
          <span>ইন স্টক</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-gray-900 text-sm sm:text-base group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
            {product.banglaName || product.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Rating Stars */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{product.rating}</span>
            <span className="text-[10px] text-gray-400">({product.reviewCount} রিভিউ)</span>
          </div>
        </div>

        {/* Variant Selector Pills (if product has variants) */}
        {product.variants && product.variants.length > 0 && (
          <div className="pt-1">
            <div className="text-[11px] font-bold text-gray-600 mb-1.5">পরিমাণ নির্বাচন করুন:</div>
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                    selectedVariant?.id === variant.id
                      ? 'bg-emerald-800 text-amber-300 border-emerald-800 shadow-xs'
                      : 'bg-emerald-50/50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {variant.unitName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price display & Direct Express Checkout Button */}
        <div className="pt-2 border-t border-emerald-50 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-gray-500 font-medium">মূল্য: </span>
              <span className="text-lg sm:text-xl font-black text-emerald-800">
                ৳{currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through ml-1.5">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
              ক্যাশ অন ডেলিভারি
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Direct Express Order Button (High Converting Signature Feature) */}
            <button
              onClick={handleDirectCheckout}
              className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm py-2.5 px-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 border border-emerald-600 hover:shadow-lg active:scale-95"
            >
              <span>অর্ডার করুন</span>
            </button>

            {/* Add To Cart Secondary */}
            <button
              onClick={handleAddToCart}
              className={`font-bold text-xs sm:text-sm py-2.5 px-2 rounded-xl border transition flex items-center justify-center gap-1 active:scale-95 ${
                addedToast
                  ? 'bg-amber-400 text-emerald-950 border-amber-400'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{addedToast ? 'যোগ হয়েছে!' : 'কার্টে রাখুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
