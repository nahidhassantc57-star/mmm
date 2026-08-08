import React from 'react';
import { Product, ProductVariant } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface CartItem {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variantId: string | undefined, delta: number) => void;
  onRemoveItem: (productId: string, variantId?: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price = item.selectedVariant
      ? item.selectedVariant.salePrice ?? item.selectedVariant.price
      : item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-base">আপনার শপিং কার্ট ({items.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl">
                🛒
              </div>
              <p className="font-extrabold text-gray-800 text-base">আপনার কার্ট খালি!</p>
              <p className="text-xs text-gray-500 max-w-xs">
                আমাদের খাঁটি ও প্রাকৃতির খাদ্যপণ্য থেকে পছন্দসই খাবার সিলেক্ট করুন।
              </p>
              <button
                onClick={onClose}
                className="bg-emerald-800 text-amber-300 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:bg-emerald-900 transition"
              >
                পণ্য দেখুন
              </button>
            </div>
          ) : (
            items.map((item, idx) => {
              const itemPrice = item.selectedVariant
                ? item.selectedVariant.salePrice ?? item.selectedVariant.price
                : item.product.salePrice ?? item.product.price;

              return (
                <div
                  key={idx}
                  className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-2xl flex gap-3 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.banglaName || item.product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-emerald-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <h3 className="font-extrabold text-gray-900 text-xs sm:text-sm truncate">
                      {item.product.banglaName || item.product.name}
                    </h3>

                    <div className="text-[11px] text-emerald-700 font-semibold">
                      {item.selectedVariant?.unitName || '১ প্যাক'} - ৳{itemPrice.toLocaleString()}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-gray-300 bg-white rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant?.id, -1)}
                          className="px-2 py-0.5 font-bold text-gray-600 hover:bg-gray-100 text-xs"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 font-black text-xs text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.selectedVariant?.id, 1)}
                          className="px-2 py-0.5 font-bold text-gray-600 hover:bg-gray-100 text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-black text-emerald-900 text-xs sm:text-sm">
                        ৳{(itemPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id, item.selectedVariant?.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="পণ্যটি সরান"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>পণ্য সাবটোটাল:</span>
                <span className="font-bold">৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="text-emerald-700 font-semibold">৳৭০ (ঢাকা) / ৳১৩০ (বাইরে)</span>
              </div>
              <div className="flex justify-between font-black text-sm text-emerald-950 border-t pt-2">
                <span>প্রাক্কলিত মোট:</span>
                <span className="text-amber-600 text-base">৳{subtotal.toLocaleString()} + চার্জ</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-current" />
              <span>অর্ডার সম্পন্ন করুন (Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>ক্যাশ অন ডেলিভারি (পণ্য চেক করে টাকা দেওয়ার সুবিধা)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
