import React, { useState } from 'react';
import { Order } from '../types';
import { X, Search, Truck, Clock, CheckCircle2, MapPin, PackageCheck } from 'lucide-react';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [invoiceInput, setInvoiceInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setFoundOrder(null);

    try {
      const res = await fetch(`/api/orders/${invoiceInput.trim()}`);
      const data = await res.json();
      if (data.success && data.data) {
        setFoundOrder(data.data);
      } else {
        setErrorMsg('সঠিক ইনভয়েস নম্বর লিখুন (যেমন: GB-20260808-1092)');
      }
    } catch (err) {
      setErrorMsg('অর্ডার আপডেট ট্র্যাকিং এ সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 my-auto">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-base">অর্ডার ট্র্যাকিং স্ট্যাটাস</h2>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleTrack} className="space-y-2">
            <label className="block text-xs font-bold text-gray-700">
              আপনার ইনভয়েস নম্বর লিখুন:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={invoiceInput}
                onChange={(e) => setInvoiceInput(e.target.value)}
                placeholder="যেমন: GB-20260808-1092"
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-800 text-amber-300 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-900 transition flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>খুঁজুন</span>
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-bold text-center">
              {errorMsg}
            </div>
          )}

          {foundOrder && (
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-amber-200 pb-2">
                <span className="font-mono font-black text-emerald-900">{foundOrder.invoiceNo}</span>
                <span className="bg-emerald-800 text-amber-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                  {foundOrder.status}
                </span>
              </div>

              <div className="space-y-1 text-gray-800">
                <div><span className="font-bold">গ্রাহক:</span> {foundOrder.customerName} ({foundOrder.customerPhone})</div>
                <div><span className="font-bold">ঠিকানা:</span> {foundOrder.customerAddress}</div>
                <div><span className="font-bold">সর্বমোট প্রদেয়:</span> ৳{foundOrder.grandTotal} ({foundOrder.paymentMethod.toUpperCase()})</div>
              </div>

              {/* Status Indicator */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-extrabold text-emerald-900">
                    {foundOrder.status === 'pending' && 'অর্ডার টি পেন্ডিং অবস্থায় আছে। কাস্টমার কেয়ার কল করবে।'}
                    {foundOrder.status === 'processing' && 'প্যাক করা হচ্ছে এবং শিপিং এর জন্য প্রস্তুত।'}
                    {foundOrder.status === 'shipped' && 'ডেলিভারি ম্যান কুরিয়ারের মাধ্যমে পণ্য নিয়ে রওয়ানা দিয়েছে!'}
                    {foundOrder.status === 'delivered' && 'পণ্য ডেলিভারি সম্পন্ন হয়েছে। ধন্যবাদ!'}
                    {foundOrder.status === 'cancelled' && 'অর্ডারটি বাতিল করা হয়েছে।'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
