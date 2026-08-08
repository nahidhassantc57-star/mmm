import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { X, Star, ShieldCheck, CheckCircle2, ShoppingBag, Zap, Truck, MessageSquare } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onDirectCheckout: (product: Product, selectedVariant?: ProductVariant) => void;
  onAddToCart: (product: Product, selectedVariant?: ProductVariant) => void;
  onAskAiAdvisor: (productName: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onDirectCheckout,
  onAddToCart,
  onAskAiAdvisor
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );

  const currentPrice = selectedVariant
    ? selectedVariant.salePrice ?? selectedVariant.price
    : product.salePrice ?? product.price;

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = currentPrice < originalPrice;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[92vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌱</span>
            <span className="font-extrabold text-sm sm:text-base">পণ্য বিবরণ ও উপকারিতা</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="space-y-3">
              <div className="aspect-square bg-emerald-50 rounded-2xl overflow-hidden border border-emerald-100 relative">
                <img
                  src={product.image}
                  alt={product.banglaName || product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 bg-amber-400 text-emerald-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                  ১০০% খাঁটি পণ্য
                </span>
              </div>

              {/* AI Question Trigger Card */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-900">এই পণ্যটি কীভাবে খাবেন বা ব্যবহার করবেন?</div>
                  <div className="text-[11px] text-emerald-700">AI স্বাস্থ্য পরামর্শকের কাছে জানুন</div>
                </div>
                <button
                  onClick={() => onAskAiAdvisor(product.banglaName || product.name)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 shadow-sm"
                >
                  জিজ্ঞাসা করুন 🤖
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                  {product.banglaName || product.name}
                </h1>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  {product.shortDescription}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-800">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount} কাস্টমার রিভিউ)</span>
                </div>
              </div>

              {/* Price & Discount */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-500 font-medium">নির্ধারিত মূল্য:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-900">
                      ৳{currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-amber-400 text-emerald-950 font-black px-2.5 py-1 rounded-full shadow-xs">
                    ক্যাশ অন ডেলিভারি
                  </span>
                </div>
              </div>

              {/* Variant Picker */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    পরিমাণ বা ওজন সিলেক্ট করুন:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-2 rounded-xl text-center border transition ${
                          selectedVariant?.id === v.id
                            ? 'bg-emerald-800 text-amber-300 border-emerald-800 font-bold shadow-sm'
                            : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="text-xs">{v.unitName}</div>
                        <div className="text-[11px] opacity-90">৳{v.salePrice ?? v.price}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Benefits List */}
              {product.benefits && product.benefits.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>প্রধান উপকারিতা ও বৈশিষ্ট্য:</span>
                  </h3>
                  <ul className="grid grid-cols-1 gap-1.5 text-xs text-gray-700">
                    {product.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* High-Converting Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onDirectCheckout(product, selectedVariant);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-base"
                >
                  <Zap className="w-5 h-5 text-amber-300 fill-current" />
                  <span>সরাসরি অর্ডার করুন (Express Checkout)</span>
                </button>

                <button
                  onClick={() => onAddToCart(product, selectedVariant)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-3 rounded-2xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description Paragraph */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <h3 className="text-sm font-extrabold text-gray-900">বিস্তারিত বিবরণ:</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {product.description}
            </p>
          </div>

          {/* Customer Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>কাস্টমার রিভিউ ({product.reviews.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="bg-amber-50/50 border border-amber-200/60 p-3 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-gray-900">{rev.authorName}</span>
                      <span className="text-[10px] text-gray-400">{rev.date} ({rev.location})</span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 font-medium italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
