import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, CheckCircle2, PhoneCall, Zap } from 'lucide-react';

interface HeroBannerProps {
  onQuickCategoryClick?: (categoryId: string) => void;
  onExpressOrderClick?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onQuickCategoryClick, onExpressOrderClick }) => {
  return (
    <div className="bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-900 text-white py-6 sm:py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Banner Container */}
        <div className="bg-emerald-950/80 rounded-3xl border border-emerald-700/60 p-6 sm:p-10 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Banner Text Left */}
          <div className="lg:col-span-7 space-y-4 z-10">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold">
              <Zap className="w-4 h-4 fill-current text-amber-400 animate-bounce" />
              <span>১০০% খাঁটি ও প্রাকৃতিক অর্গানিক খাদ্যপণ্য</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              সুস্বাস্থ্য ও খাঁটি খাবারের নির্ভরযোগ্য নাম{' '}
              <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-4">
                ঘরের বাজার
              </span>
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-xl">
              সুন্দরবনের খাঁটি মধু, পাবনার গাওয়া ঘি, কাঠের ঘানির সরিষার তেল, প্রিমিয়াম আজওয়া খেজুর ও প্রিমিয়াম মিক্সড বাদাম। কোনো প্রকার প্রিজারভেটিভ বা কেমিক্যাল ছাড়াই শতভাগ ন্যাচারাল টেস্ট!
            </p>

            {/* Guarantees Bullet points */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs sm:text-sm text-emerald-200 font-semibold">
              <div className="flex items-center gap-2 bg-emerald-900/60 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>পণ্য হাতে পেয়ে চেক করে পেমেন্ট</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-900/60 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-900/60 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>১০০% বিএসটিআই ও ফুড সার্টিফাইড</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-900/60 p-2 rounded-lg border border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>পছন্দ না হলে সাথে সাথেই রিটার্ন</span>
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={onExpressOrderClick}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-6 py-3.5 rounded-xl text-base shadow-lg hover:shadow-amber-400/20 transition transform active:scale-95 flex items-center gap-2"
              >
                <span>🛒 সরাসরি অর্ডার করুন (Express Checkout)</span>
              </button>

              <a
                href="tel:01700000000"
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-xl text-sm border border-emerald-600 transition flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>কল দিয়ে অর্ডার দিন</span>
              </a>
            </div>
          </div>

          {/* Banner Product Showcase Right */}
          <div className="lg:col-span-5 relative z-10 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-emerald-900 border border-emerald-700/80 rounded-2xl overflow-hidden p-3 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1509358217973-887153386701?auto=format&fit=crop&q=80&w=800"
                  alt="Organic Super Combo Ghorer Bazar"
                  className="w-full h-64 sm:h-72 object-cover rounded-xl group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-3 bg-emerald-950/90 p-3 rounded-xl border border-emerald-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-amber-300 font-extrabold text-sm">সুপার ইমিউনিটি বুস্টার কম্বো</div>
                    <div className="text-xs text-emerald-200">মধু + ঘি + বাদাম + আজওয়া খেজুর</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-emerald-400">৳৩,৬০০</span>
                    <div className="text-amber-400 font-black text-lg">৳২,৯৯০</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">১০০% অর্গানিক</div>
              <div className="text-[11px] text-emerald-300">কোন কেমিক্যাল মুক্ত</div>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">ক্যাশ অন ডেলিভারি</div>
              <div className="text-[11px] text-emerald-300">হাতে পেয়ে টাকা দিন</div>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">সহজ রিটার্ন সুযোগ</div>
              <div className="text-[11px] text-emerald-300">পছন্দ না হলে সাথে ফেরত</div>
            </div>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">খাঁটি মানের গ্যারান্টি</div>
              <div className="text-[11px] text-emerald-300">সেরা বিশুদ্ধ উপাদান</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
