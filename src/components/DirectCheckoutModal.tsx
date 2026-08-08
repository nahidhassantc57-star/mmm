import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, DeliveryZone, Order } from '../types';
import { X, ShieldCheck, Truck, CheckCircle2, Phone, MapPin, User, FileText, Lock } from 'lucide-react';

interface DirectCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  selectedVariant?: ProductVariant;
  cartItems?: Array<{ product: Product; selectedVariant?: ProductVariant; quantity: number }>;
  onOrderSuccess: (order: Order) => void;
}

export const DirectCheckoutModal: React.FC<DirectCheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedVariant: initialVariant,
  cartItems = [],
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const isCartCheckout = !product && cartItems.length > 0;

  // Selected Variant state for single product mode
  const [activeVariant, setActiveVariant] = useState<ProductVariant | undefined>(
    initialVariant || (product?.variants && product.variants.length > 0 ? product.variants[0] : undefined)
  );

  const [quantity, setQuantity] = useState<number>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [note, setNote] = useState('');

  // Form Error
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialVariant) {
      setActiveVariant(initialVariant);
    } else if (product?.variants && product.variants.length > 0) {
      setActiveVariant(product.variants[0]);
    }
  }, [product, initialVariant]);

  // Unit Price calculation
  const unitPrice = isCartCheckout
    ? 0
    : activeVariant
    ? activeVariant.salePrice ?? activeVariant.price
    : product?.salePrice ?? product?.price ?? 0;

  // Subtotal calculation
  const subtotal = isCartCheckout
    ? cartItems.reduce((acc, item) => {
        const itemPrice = item.selectedVariant
          ? item.selectedVariant.salePrice ?? item.selectedVariant.price
          : item.product.salePrice ?? item.product.price;
        return acc + itemPrice * item.quantity;
      }, 0)
    : unitPrice * quantity;

  // Delivery Charge
  const deliveryCharge = deliveryZone === 'inside_dhaka' ? 70 : 130;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার নাম প্রদান করুন');
      return;
    }

    const cleanedPhone = customerPhone.replace(/\D/g, '');
    if (cleanedPhone.length < 11) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)');
      return;
    }

    if (!customerAddress.trim()) {
      setErrorMessage('অনুগ্রহ করে সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন');
      return;
    }

    setIsSubmitting(true);

    try {
      let bodyData: any = {
        customerName: customerName.trim(),
        customerPhone: cleanedPhone,
        customerAddress: customerAddress.trim(),
        deliveryZone,
        paymentMethod,
        note
      };

      if (!isCartCheckout && product) {
        bodyData.productId = product.id;
        bodyData.variantId = activeVariant?.id;
        bodyData.quantity = quantity;
      } else {
        bodyData.items = cartItems.map(item => {
          const price = item.selectedVariant
            ? item.selectedVariant.salePrice ?? item.selectedVariant.price
            : item.product.salePrice ?? item.product.price;
          return {
            productId: item.product.id,
            productName: item.product.banglaName || item.product.name,
            variantId: item.selectedVariant?.id,
            variantName: item.selectedVariant?.unitName || '১ প্যাক',
            unitPrice: price,
            quantity: item.quantity,
            totalPrice: price * item.quantity,
            image: item.product.image
          };
        });
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (data.success && data.data) {
        onOrderSuccess(data.data);
      } else {
        setErrorMessage(data.message || 'অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন');
      }
    } catch (err) {
      setErrorMessage('নেটওয়ার্ক ত্রুটি! অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[92vh] flex flex-col my-auto">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-emerald-950 font-black flex items-center justify-center text-sm">
              🌱
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-extrabold leading-tight">
                দ্রুত অর্ডার সার্ভিস (Express Checkout)
              </h2>
              <p className="text-[11px] text-amber-300 font-semibold">
                অর্ডার করতে নিচের তথ্যগুলো সঠিক প্রদান করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-700 text-emerald-100 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Selected Product Summary Card */}
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 sm:p-4 space-y-3">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>আপনার নির্বাচিত পণ্য:</span>
            </div>

            {!isCartCheckout && product ? (
              <div className="flex gap-3 items-center">
                <img
                  src={product.image}
                  alt={product.banglaName || product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-amber-200 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-gray-900 text-sm sm:text-base truncate">
                    {product.banglaName || product.name}
                  </h3>

                  {/* Variant Switcher Pills */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setActiveVariant(v)}
                          className={`px-2 py-0.5 rounded-md text-xs font-bold transition border ${
                            activeVariant?.id === v.id
                              ? 'bg-emerald-800 text-amber-300 border-emerald-800'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {v.unitName} (৳{v.salePrice ?? v.price})
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-800">
                      একক মূল্য: ৳{unitPrice.toLocaleString()}
                    </span>

                    {/* Quantity Controller */}
                    <div className="flex items-center border border-emerald-300 bg-white rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-2.5 py-0.5 font-bold text-gray-700 hover:bg-emerald-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 font-black text-xs text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-2.5 py-0.5 font-bold text-gray-700 hover:bg-emerald-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-amber-200/60 last:border-0">
                    <div className="font-bold text-gray-800">
                      {item.product.banglaName || item.product.name}{' '}
                      <span className="text-emerald-700">({item.selectedVariant?.unitName || '১ প্যাক'})</span> x {item.quantity}
                    </div>
                    <div className="font-black text-emerald-800">
                      ৳
                      {(
                        (item.selectedVariant
                          ? item.selectedVariant.salePrice ?? item.selectedVariant.price
                          : item.product.salePrice ?? item.product.price) * item.quantity
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <span>⚠️ {errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>আপনার নাম *</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                />
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>মোবাইল নম্বর *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="১১ ডিজিটের মোবাইল নম্বর (যেমন: 01700000000)"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>সম্পূর্ণ ডেলিভারি ঠিকানা *</span>
              </label>
              <textarea
                required
                rows={2}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="বাড়ি/হোল্ডিং নম্বর, রোড, এলাকা/উপজেলা, জেলা লিখুন"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            {/* Delivery Zone Radio Buttons */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-700" />
                <span>ডেলিভারি এরিয়া নির্বাচন করুন *</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition ${
                    deliveryZone === 'inside_dhaka'
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      value="inside_dhaka"
                      checked={deliveryZone === 'inside_dhaka'}
                      onChange={() => setDeliveryZone('inside_dhaka')}
                      className="accent-emerald-700"
                    />
                    <span className="text-xs">📍 ঢাকার ভেতরে</span>
                  </div>
                  <span className="text-xs font-black text-emerald-800">৳৭০</span>
                </label>

                <label
                  className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition ${
                    deliveryZone === 'outside_dhaka'
                      ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-bold'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deliveryZone"
                      value="outside_dhaka"
                      checked={deliveryZone === 'outside_dhaka'}
                      onChange={() => setDeliveryZone('outside_dhaka')}
                      className="accent-emerald-700"
                    />
                    <span className="text-xs">🚚 ঢাকার বাইরে</span>
                  </div>
                  <span className="text-xs font-black text-emerald-800">৳১৩০</span>
                </label>
              </div>
            </div>

            {/* Payment Method Option */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5">
                পেমেন্ট পদ্ধতি:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <label
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-700 bg-emerald-800 text-amber-300 font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <div className="text-xs">💵 ক্যাশ অন ডেলিভারি</div>
                </label>

                <label
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-600 text-white font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bkash"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => setPaymentMethod('bkash')}
                    className="sr-only"
                  />
                  <div className="text-xs">📱 বিকাশ (bKash)</div>
                </label>

                <label
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-600 text-white font-bold'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="nagad"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => setPaymentMethod('nagad')}
                    className="sr-only"
                  />
                  <div className="text-xs">📱 নগদ (Nagad)</div>
                </label>
              </div>
            </div>

            {/* Note Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <span>অতিরিক্ত কোনো নির্দেশ (ঐচ্ছিক):</span>
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="যেমন: বিকেলে ডেলিভারি করবেন বা কল করে আসবেন..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs focus:bg-white focus:outline-none"
              />
            </div>

            {/* Live Calculation Bill Breakdown Box */}
            <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-1.5 shadow-inner">
              <div className="flex justify-between text-xs text-emerald-200">
                <span>পণ্য মূল্য (Subtotal):</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-200">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{deliveryCharge}</span>
              </div>
              <div className="border-t border-emerald-800 pt-2 flex justify-between items-center">
                <span className="text-sm font-bold text-amber-300">সর্বমোট প্রদেয়:</span>
                <span className="text-xl font-black text-amber-400">
                  ৳{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Confirm Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base sm:text-lg py-3.5 rounded-2xl shadow-xl transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>প্রসেসিং হচ্ছে...</span>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-amber-300" />
                  <span>অর্ডার কনফার্ম করুন (৳{grandTotal.toLocaleString()})</span>
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="text-center pt-1 text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>পণ্য ডেলিভারির পর কোয়ালিটি দেখে মূল্য পরিশোধ করবেন। পছন্দ না হলে ক্যাশ অন রিটার্ন।</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
