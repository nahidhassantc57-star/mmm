import React from 'react';
import { Order } from '../types';
import { CheckCircle2, ShoppingBag, Printer, Share2, Phone, MapPin, PackageCheck, Truck } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handleWhatsAppShare = () => {
    const text = `Hello Ghorer Bazar! My Order Invoice is ${order.invoiceNo}.%0AName: ${order.customerName}%0APhone: ${order.customerPhone}%0ATotal Amount: BDT ${order.grandTotal}.%0APlease confirm my order.`;
    window.open(`https://wa.me/8801700000000?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border-t-8 border-emerald-600 max-h-[92vh] flex flex-col my-auto">
        {/* Top Celebration Header */}
        <div className="p-6 text-center space-y-2 bg-emerald-50 border-b border-emerald-100">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg text-3xl animate-bounce">
            🎉
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-900">
            ধন্যবাদ! আপনার অর্ডারটি সফল হয়েছে।
          </h2>
          <p className="text-xs sm:text-sm text-emerald-700 font-semibold">
            আমাদের কাস্টমার কেয়ার প্রতিনিধি খুব শীঘ্রই কল করে অর্ডারটি কনফার্ম করবেন।
          </p>

          <div className="inline-block bg-emerald-800 text-amber-300 font-mono font-black text-sm sm:text-base px-4 py-1.5 rounded-full shadow-sm mt-2">
            ইনভয়েস নং: {order.invoiceNo}
          </div>
        </div>

        {/* Status Stepper */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="text-xs font-bold text-gray-500 mb-2 text-center uppercase tracking-wider">
            অর্ডার আপডেট ট্র্যাকিং:
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold max-w-sm mx-auto">
            <div className="flex flex-col items-center text-emerald-700">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                ✓
              </div>
              <span className="mt-1">অর্ডার প্রাপ্ত</span>
            </div>

            <div className="h-0.5 flex-1 bg-emerald-500 mx-1"></div>

            <div className={`flex flex-col items-center ${order.status !== 'pending' ? 'text-emerald-700' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${order.status !== 'pending' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                ২
              </div>
              <span className="mt-1">কনফার্মড</span>
            </div>

            <div className="h-0.5 flex-1 bg-gray-200 mx-1"></div>

            <div className="flex flex-col items-center text-gray-400">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">
                ৩
              </div>
              <span className="mt-1">ডেলিভারিতে</span>
            </div>
          </div>
        </div>

        {/* Invoice Body Details */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Customer Info Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
            <div className="font-extrabold text-gray-900 border-b border-gray-200 pb-1.5 text-xs text-emerald-800 uppercase">
              গ্রাহকের ডেলিভারি বিবরণ:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <div><span className="font-bold">নাম:</span> {order.customerName}</div>
              <div><span className="font-bold">ফোন:</span> {order.customerPhone}</div>
              <div className="sm:col-span-2"><span className="font-bold">ঠিকানা:</span> {order.customerAddress}</div>
              <div>
                <span className="font-bold">এরিয়া:</span>{' '}
                {order.deliveryZone === 'inside_dhaka' ? 'ঢাকার ভেতরে (৳৭০)' : 'ঢাকার বাইরে (৳১৩০)'}
              </div>
              <div>
                <span className="font-bold">পেমেন্ট মেথড:</span>{' '}
                <span className="uppercase font-bold text-emerald-800">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-emerald-900 text-white px-3 py-2 font-bold text-xs flex justify-between">
              <span>পণ্য বিবরণ</span>
              <span>মূল্য</span>
            </div>

            <div className="divide-y divide-gray-100 bg-white">
              {order.items.map((it, i) => (
                <div key={i} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {it.image && (
                      <img src={it.image} alt={it.productName} className="w-10 h-10 object-cover rounded-lg border border-gray-200" referrerPolicy="no-referrer" />
                    )}
                    <div>
                      <div className="font-extrabold text-gray-900">{it.productName}</div>
                      <div className="text-[11px] text-gray-500">
                        {it.variantName} x {it.quantity} (৳{it.unitPrice.toLocaleString()})
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-emerald-800 text-right">
                    ৳{it.totalPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-3 border-t border-gray-200 space-y-1 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>পণ্য সাবটোটাল:</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>৳{order.deliveryCharge}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-emerald-900 border-t pt-1.5">
                <span>সর্বমোট (ক্যাশ অন ডেলিভারি):</span>
                <span className="text-amber-600">৳{order.grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm"
            >
              <span>💬 হোয়াটসঅ্যাপে সাপোর্ট টিমকে জানান</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl border border-gray-300 transition flex items-center justify-center gap-1.5 text-xs"
              >
                <Printer className="w-4 h-4 text-gray-600" />
                <span>মেমো প্রিন্ট করুন</span>
              </button>

              <button
                onClick={onClose}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>আরও কেনাকাটা করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
