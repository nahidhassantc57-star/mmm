import { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Products',
    banglaName: 'সকল পণ্য',
    slug: 'all',
    iconName: 'ShoppingBag'
  },
  {
    id: 'honey',
    name: 'Pure Honey',
    banglaName: 'খাঁটি মধু',
    slug: 'pure-honey',
    iconName: 'Droplet',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'ghee-oil',
    name: 'Ghee & Oils',
    banglaName: 'গাওয়া ঘি ও খাঁটি তেল',
    slug: 'ghee-oil',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'nuts-seeds',
    name: 'Nuts & Seeds',
    banglaName: 'বাদাম ও বীজ',
    slug: 'nuts-seeds',
    iconName: 'Nut',
    image: 'https://images.unsplash.com/photo-1543158266-0066955047b1?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dates-dryfruits',
    name: 'Dates & Dry Fruits',
    banglaName: 'খেজুর ও ড্রাই ফ্রুটস',
    slug: 'dates-dryfruits',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'spices-organics',
    name: 'Organic Spices',
    banglaName: 'অর্গানিক মসলা ও চাল',
    slug: 'spices-organics',
    iconName: 'Utensils',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'combos',
    name: 'Special Combos',
    banglaName: 'স্পেশাল কম্বো অফার',
    slug: 'combos',
    iconName: 'Gift',
    image: 'https://images.unsplash.com/photo-1509358217973-887153386701?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'gb-honey-01',
    name: 'Sundarban Kholisha Flower Honey',
    banglaName: 'সুন্দরবনের খলিসা ফুলের প্রাকৃতিক মধু',
    slug: 'sundarban-kholisha-honey',
    categoryId: 'honey',
    shortDescription: 'সুন্দরবনের গভীর জঙ্গল থেকে প্রাকৃতিকভাবে সংগৃহীত ১০০% প্রাকৃতিক ও খাঁটি খলিসা ফুলের মধু।',
    description: 'আমাদের সুন্দরবনের খলিসা ফুলের মধু সরাসরি সুন্দরবনের অভিজ্ঞ মৌয়ালদের থেকে সংগৃহীত। এতে কোন প্রকার কেমিক্যাল, প্রিজারভেটিভ বা আর্টিফিশিয়াল সুগার যোগ করা হয় না। খলিসা ফুলের মধু হালকা সোনালী রঙের ও সুস্বাদু হালকা সুবাসযুক্ত হয়ে থাকে।',
    benefits: [
      'রোগ প্রতিরোধ ক্ষমতা বহুগুণ বৃদ্ধি করে',
      'সর্দি, কাশি ও গলার খুসখুস কমায়',
      'হজমশক্তি বৃদ্ধি করে ও ওজন নিয়ন্ত্রণে সাহায্য করে',
      'প্রাকৃতিক এনার্জি বুস্টার হিসেবে কাজ করে'
    ],
    price: 1200,
    salePrice: 990,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.9,
    reviewCount: 342,
    variants: [
      { id: 'v-1', unitName: '৫০০ গ্রাম', price: 650, salePrice: 520, inStock: true },
      { id: 'v-2', unitName: '১ কেজি', price: 1200, salePrice: 990, inStock: true },
      { id: 'v-3', unitName: '২ কেজি', price: 2300, salePrice: 1890, inStock: true }
    ],
    reviews: [
      {
        id: 'r1',
        authorName: 'তানভীর আহমেদ',
        rating: 5,
        comment: 'সুন্দরবনের মধুর আসল স্বাদ পেলাম! ঘরের বাজার কে অসংখ্য ধন্যবাদ দ্রুত ডেলিভারির জন্য।',
        date: '২ দিন আগে',
        location: 'ঢাকা'
      },
      {
        id: 'r2',
        authorName: 'সুমাইয়া ইসলাম',
        rating: 5,
        comment: 'প্যাকিং অনেক সুন্দর ছিল এবং খাঁটি মধু। পরিবার সবাই পছন্দ করেছে।',
        date: '৪ দিন আগে',
        location: 'চট্টগ্রাম'
      }
    ]
  },
  {
    id: 'gb-ghee-01',
    name: 'Premium Pure Cow Milk Ghee',
    banglaName: 'প্রিমিয়াম খাঁটি গরুর দুধের গাওয়া ঘি',
    slug: 'pure-gawa-ghee',
    categoryId: 'ghee-oil',
    shortDescription: 'পাবনার গাভীর খাঁটি দুধের সর থেকে ট্র্যাডিশনাল কায়দায় তৈরি সুবাসিত দানাযুক্ত গাওয়া ঘি।',
    description: 'আমাদের গাওয়া ঘি সম্পূর্ণ খাঁটি গরুর দুধের সর জ্বাল দিয়ে সনাতন পদ্ধতিতে তৈরি। এতে অসাধারণ ঘ্রাণ, দানাযুক্ত টেক্সচার ও অকৃত্রিম স্বাদ বিদ্যমান। খিচুড়ি, পোলাও বা গরম ভাতে আসল ঘিয়ের স্বাদ উপভোগ করুন।',
    benefits: [
      'মস্তিষ্ক ও মেধা বৃদ্ধিতে সহায়ক',
      'হাড় ও জোড়ার স্বাস্থ্য উন্নত করে',
      'ত্বক ও চুলের প্রাকৃতির উজ্জ্বলতা জোগায়',
      'ভিটামিন A, D, E ও K সমৃদ্ধ'
    ],
    price: 1600,
    salePrice: 1390,
    image: 'https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.95,
    reviewCount: 489,
    variants: [
      { id: 'vg-1', unitName: '২৫০ গ্রাম', price: 500, salePrice: 420, inStock: true },
      { id: 'vg-2', unitName: '৫০০ গ্রাম', price: 900, salePrice: 750, inStock: true },
      { id: 'vg-3', unitName: '১ কেজি', price: 1600, salePrice: 1390, inStock: true }
    ],
    reviews: [
      {
        id: 'rg1',
        authorName: 'ইঞ্জিনিয়ার শাহাদাত হোসেন',
        rating: 5,
        comment: 'অসাধারণ ঘ্রাণ ও দানা! একদম গ্রামের নানির হাতের তৈরি ঘিয়ের মতো।',
        date: '১ দিন আগে',
        location: 'সিলেট'
      }
    ]
  },
  {
    id: 'gb-oil-01',
    name: 'Cold Pressed Wood Ghani Mustard Oil',
    banglaName: 'কাঠের ঘানিতে ভাঙা খাঁটি কাঠের ঘানির সরিষার তেল',
    slug: 'wood-pressed-mustard-oil',
    categoryId: 'ghee-oil',
    shortDescription: 'দেশি মাঘি সরিষা থেকে কাঠের ঘানিতে ঠাণ্ডা চাপ পদ্ধতিতে নিষ্কাশিত ঝাঁঝালো ও পুষ্টিকর সরিষার তেল।',
    description: 'আমাদের সরিষার তেল কাঠের ঘানিতে প্রথম চাপে নিষ্কাশিত হওয়ায় এর طبیعی পুষ্টিগুণ, ভিটামিন-ই ও অ্যান্টিঅক্সিডেন্ট সম্পূর্ণ অক্ষুণ্ণ থাকে। রান্না বা ভর্তায় খাঁটি ঝাঁঝালো স্বাদের জন্য সেরা।',
    benefits: [
      'হার্টের জন্য অত্যন্ত উপকারী',
      'কোলেস্টেরল নিয়ন্ত্রণে রাখে',
      'প্রাকৃতিক ঝাঁঝ ও আসল পুষ্টিতে ভরপুর',
      'পেশী ও ত্বকের মাশাজে চমৎকার কাজ করে'
    ],
    price: 380,
    salePrice: 320,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    rating: 4.85,
    reviewCount: 215,
    variants: [
      { id: 'vo-1', unitName: '১ লিটার', price: 380, salePrice: 320, inStock: true },
      { id: 'vo-2', unitName: '২ লিটার', price: 740, salePrice: 620, inStock: true },
      { id: 'vo-3', unitName: '৫ লিটার', price: 1800, salePrice: 1500, inStock: true }
    ]
  },
  {
    id: 'gb-nuts-01',
    name: 'Premium Roasted Mixed Nuts',
    banglaName: 'প্রিমিয়াম রোস্টেড মিক্সড বাদাম (১২ পদের ড্রাই ফ্রুটস কম্বো)',
    slug: 'premium-mixed-nuts',
    categoryId: 'nuts-seeds',
    shortDescription: 'কাজুবাদাম, কাঠবাদাম, পেস্তাবাদাম, আখরোট, কিশমিশ ও প্রিমিয়াম ডুমুরের পুষ্টিকর মুখরোচক মিক্সড বাদাম।',
    description: '১২ পদের প্রিমিয়াম কোয়ালিটির বাদাম ও ড্রাই ফ্রুটসের পারফেক্ট কম্বিনেশন। হালকা কম আঁচে ঘি দিয়ে হালকা শেকা, যা আপনাকে প্রতিদিন দেবে শক্তি ও অফুরন্ত এনার্জি।',
    benefits: [
      'ব্রেইন ডেভেলপমেন্ট ও মেধা বৃদ্ধিতে দারুণ কার্যকর',
      'প্রাকৃতিক প্রোটিন, ফাইবার ও হেলদি ফ্যাট সমৃদ্ধ',
      'সারাদিনের ক্লান্তি দূর করে এনার্জি বাড়ায়',
      'শিশুদের আদর্শ স্বাস্থ্যকর স্ন্যাক্স'
    ],
    price: 1100,
    salePrice: 890,
    image: 'https://images.unsplash.com/photo-1543158266-0066955047b1?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.92,
    reviewCount: 310,
    variants: [
      { id: 'vn-1', unitName: '২৫০ গ্রাম', price: 550, salePrice: 460, inStock: true },
      { id: 'vn-2', unitName: '৫০ গ্রাম', price: 1100, salePrice: 890, inStock: true },
      { id: 'vn-3', unitName: '১ কেজি', price: 2100, salePrice: 1750, inStock: true }
    ]
  },
  {
    id: 'gb-dates-01',
    name: 'Madinah Saudi Ajwa Dates',
    banglaName: 'মদিনার প্রিমিয়াম সউদী আজওয়া খেজুর',
    slug: 'saudi-ajwa-dates',
    categoryId: 'dates-dryfruits',
    shortDescription: 'মদিনা মুনাওয়ারা থেকে সরাসরি আমদানিকৃত নরম, মিষ্টি ও প্রিমিয়াম গ্রেড আজওয়া খেজুর।',
    description: 'পবিত্র মদিনার বিশেষ বাগানের আজওয়া খেজুর যা রাসুলুল্লাহ (সাঃ) এর সুন্নাত ও রোগব্যাধি প্রতিরোধী শেফা হিসেবে বিখ্যাত। নরম টেক্সচার, খাঁটি মান ও ফ্রেশ স্বাদের নিশ্চয়তা।',
    benefits: [
      'হৃদরোগ ও রক্তচাপ নিয়ন্ত্রণে সহায়ক',
      'তাৎক্ষণিক এনার্জি যোগায়',
      'আইরন ও ক্যালসিয়াম সমৃদ্ধ',
      'পেটের হজম প্রক্রিয়া সচল রাখে'
    ],
    price: 1400,
    salePrice: 1150,
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.98,
    reviewCount: 520,
    variants: [
      { id: 'vd-1', unitName: '৫০০ গ্রাম', price: 750, salePrice: 620, inStock: true },
      { id: 'vd-2', unitName: '১ কেজি', price: 1400, salePrice: 1150, inStock: true }
    ]
  },
  {
    id: 'gb-seed-01',
    name: 'Organic Raw Blackseed Oil',
    banglaName: 'খাঁটি কোল্ড প্রেসড কালিজিরা তেল',
    slug: 'cold-pressed-blackseed-oil',
    categoryId: 'ghee-oil',
    shortDescription: 'কোল্ড প্রেসড পদ্ধতিতে নিষ্কাশিত মৃত্যু ব্যতীত সকল রোগের মহৌষধ খাঁটি কালিজিরা তেল।',
    description: 'সর্বোত্তম দেশি কালিজিরা বীজ থেকে কোল্ড প্রেস মেশিনে প্রথম তাপে সংগৃহীত ১০০% বিশুদ্ধ ও ঝাঁঝালো কালিজিরা তেল। কোনো প্রকার ভেজাল মিশ্রণহীন।',
    benefits: [
      'রোগ প্রতিরোধ ক্ষমতা বহুলাংশে বাড়ায়',
      'হাঁপানি, সর্দি ও এলার্জি উপশম করে',
      'চুল পড়া রোধ করে ও নতুন চুল গজাতে সাহায্য করে',
      'ব্লাড সুগার লেভেল স্বাভাবিক রাখতে সহায়ক'
    ],
    price: 450,
    salePrice: 380,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800',
    isFeatured: false,
    isBestSeller: false,
    inStock: true,
    rating: 4.88,
    reviewCount: 178,
    variants: [
      { id: 'vbs-1', unitName: '১০০ মি.লি.', price: 250, salePrice: 200, inStock: true },
      { id: 'vbs-2', unitName: '২৫০ মি.লি.', price: 450, salePrice: 380, inStock: true }
    ]
  },
  {
    id: 'gb-seed-02',
    name: 'Organic Mexican White Chia Seeds',
    banglaName: 'অর্গানিক মেক্সিকান মেগা প্যাক চিয়া সিড',
    slug: 'organic-chia-seeds',
    categoryId: 'nuts-seeds',
    shortDescription: 'ওমেগা-৩ ও ফাইবারে পরিপূর্ণ সুপারফুড অর্গানিক মেক্সিকান চিয়া বীজ।',
    description: 'ওজন নিয়ন্ত্রণ, মেদ কমানো ও শরীরের বিষাক্ত উপাদান দূরীকরণে চিয়া সিড এক জাদুকরী উপাদান। পানিতে বা লেবুর শরবতে ভিজিয়ে খেলে প্রচুর ফাইবার ও দীর্ঘক্ষণ পেট ভরা অনুভূতি থাকে।',
    benefits: [
      'দ্রুত ওজন ও পেটের চর্বি কমাতে সাহায্য করে',
      'কোষ্ঠকাঠিন্য দূর করে হজম উন্নত করে',
      'প্রচুর ওমেগা-৩ ফ্যাটি এসিড ও ক্যালসিয়াম বহন করে',
      'ত্বকের স্বাস্থ্য উজ্জ্বল ও টানটান রাখে'
    ],
    price: 650,
    salePrice: 490,
    image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    rating: 4.8,
    reviewCount: 195,
    variants: [
      { id: 'vcs-1', unitName: '২৫০ গ্রাম', price: 350, salePrice: 270, inStock: true },
      { id: 'vcs-2', unitName: '৫০০ গ্রাম', price: 650, salePrice: 490, inStock: true }
    ]
  },
  {
    id: 'gb-combo-01',
    name: 'Immunity Booster Super Health Combo',
    banglaName: 'সুপার ইমিউনিটি বুস্টার কম্বো (মধু + ঘি + মিক্সড বাদাম + আজওয়া খেজুর)',
    slug: 'super-immunity-health-combo',
    categoryId: 'combos',
    shortDescription: 'পরিবারের সম্পূর্ণ পুষ্টি ও ইমিউনিটির সেরা ৪টি প্রিমিয়াম পণ্যের স্পেশাল মেগা ডিসকাউন্ট কম্বো।',
    description: 'এই কম্বো প্যাকে থাকছে: ১ কেজি সুন্দরবন মধু + ৫০০ গ্রাম গাওয়া ঘি + ৫০০ গ্রাম প্রিমিয়াম মিক্সড বাদাম + ৫০০ গ্রাম মদিনার আজওয়া খেজুর। একসাথে অর্ডার করলে পাচ্ছেন বিশাল ছাড় ও ফ্রি গিফট!',
    benefits: [
      'পুরো পরিবারের সারাদিনের শক্তির সুষম যোগান',
      'স্বতন্ত্র কেনাকাটার তুলনায় ৩০০+ টাকা সাশ্রয়',
      'প্রাকৃতিক উপায়ে ইমিউনিটি বৃদ্ধি',
      'সুন্দর আকর্ষণীয় গিফট প্যাকেজিং'
    ],
    price: 3600,
    salePrice: 2990,
    image: 'https://images.unsplash.com/photo-1509358217973-887153386701?auto=format&fit=crop&q=80&w=800',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    rating: 4.99,
    reviewCount: 680,
    variants: [
      { id: 'vcb-1', unitName: 'স্ট্যান্ডার্ড কম্বো প্যাক', price: 3600, salePrice: 2990, inStock: true }
    ]
  }
];
