import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS } from './src/data/products.ts';
import { Order, DirectOrderPayload } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for products and orders
  let productsList = [...INITIAL_PRODUCTS];
  const ordersList: Order[] = [
    {
      id: 'order-sample-1',
      invoiceNo: 'GB-20260808-1092',
      customerName: 'মো: রফিকুল ইসলাম',
      customerPhone: '01711223344',
      customerAddress: 'হাউজ ২৪, রোড ৭, ধানমন্ডি, ঢাকা',
      deliveryZone: 'inside_dhaka',
      deliveryCharge: 70,
      items: [
        {
          productId: 'gb-honey-01',
          productName: 'সুন্দরবনের খলিসা ফুলের প্রাকৃতিক মধু',
          variantId: 'v-2',
          variantName: '১ কেজি',
          unitPrice: 990,
          quantity: 1,
          totalPrice: 990,
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'
        }
      ],
      subtotal: 990,
      grandTotal: 1060,
      paymentMethod: 'cod',
      paymentStatus: 'unpaid',
      status: 'shipped',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ];

  // Initialize Gemini AI Client lazily or safely on server
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // --- API ROUTES ---

  // Get all products
  app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let filtered = [...productsList];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.categoryId === category);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.banglaName.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, data: filtered });
  });

  // Get single product
  app.get('/api/products/:id', (req, res) => {
    const product = productsList.find(p => p.id === req.params.id || p.slug === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি' });
    }
    res.json({ success: true, data: product });
  });

  // Create new product (Admin)
  app.post('/api/products', (req, res) => {
    const newProd = req.body;
    if (!newProd.name || !newProd.banglaName || !newProd.price) {
      return res.status(400).json({ success: false, message: 'প্রয়োজনীয় তথ্য সঠিকভাবে প্রদান করুন' });
    }

    const createdProduct = {
      id: 'gb-custom-' + Date.now(),
      slug: (newProd.name || 'product').toLowerCase().replace(/\s+/g, '-'),
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      variants: newProd.variants && newProd.variants.length > 0 ? newProd.variants : [
        { id: 'v-default', unitName: '১ প্যাক', price: newProd.price, salePrice: newProd.salePrice, inStock: true }
      ],
      benefits: newProd.benefits || ['১০০% প্রাকৃতিক ও খাঁটি মান', 'সার্টিফাইড অর্গানিক ফুড'],
      ...newProd
    };

    productsList.unshift(createdProduct);
    res.status(201).json({ success: true, data: createdProduct });
  });

  // Admin: Update product
  app.patch('/api/products/:id', (req, res) => {
    const idx = productsList.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি' });
    }
    productsList[idx] = { ...productsList[idx], ...req.body };
    res.json({ success: true, data: productsList[idx] });
  });

  // Admin: Delete product
  app.delete('/api/products/:id', (req, res) => {
    const idx = productsList.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'পণ্যটি পাওয়া যায়নি' });
    }
    const deleted = productsList.splice(idx, 1);
    res.json({ success: true, data: deleted[0] });
  });

  // Direct Express Order Submission (Ghorer Bazar Style)
  app.post('/api/orders', (req, res) => {
    const payload: DirectOrderPayload = req.body;

    if (!payload.customerName || !payload.customerPhone || !payload.customerAddress) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে নাম, ফোন নম্বর ও সম্পূর্ণ ঠিকানা প্রদান করুন'
      });
    }

    // Phone number validation (at least 11 digits)
    const cleanedPhone = payload.customerPhone.replace(/\D/g, '');
    if (cleanedPhone.length < 11) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন'
      });
    }

    let items = [];
    let subtotal = 0;

    if (payload.productId) {
      // Direct Single Item Express Order
      const product = productsList.find(p => p.id === payload.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'পণ্য পাওয়া যায়নি' });
      }

      let unitPrice = product.salePrice ?? product.price;
      let variantName = '১ প্যাক';

      if (payload.variantId) {
        const variant = product.variants.find(v => v.id === payload.variantId);
        if (variant) {
          unitPrice = variant.salePrice ?? variant.price;
          variantName = variant.unitName;
        }
      }

      const quantity = payload.quantity || 1;
      const itemTotal = unitPrice * quantity;
      subtotal = itemTotal;

      items.push({
        productId: product.id,
        productName: product.banglaName || product.name,
        variantId: payload.variantId,
        variantName: variantName,
        unitPrice: unitPrice,
        quantity: quantity,
        totalPrice: itemTotal,
        image: product.image
      });
    } else if (req.body.items && Array.isArray(req.body.items)) {
      // Cart items order
      items = req.body.items;
      subtotal = items.reduce((sum: number, it: any) => sum + (it.totalPrice || 0), 0);
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'অর্ডারে কোনো পণ্য নেই' });
    }

    // Delivery Fee: Inside Dhaka = 70 BDT, Outside Dhaka = 130 BDT
    const deliveryCharge = payload.deliveryZone === 'inside_dhaka' ? 70 : 130;
    const grandTotal = subtotal + deliveryCharge;

    const invoiceNo = `GB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      invoiceNo,
      customerName: payload.customerName.trim(),
      customerPhone: cleanedPhone,
      customerAddress: payload.customerAddress.trim(),
      deliveryZone: payload.deliveryZone || 'inside_dhaka',
      deliveryCharge,
      items,
      subtotal,
      grandTotal,
      paymentMethod: payload.paymentMethod || 'cod',
      paymentStatus: 'unpaid',
      status: 'pending',
      note: payload.note || '',
      createdAt: new Date().toISOString()
    };

    ordersList.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!',
      data: newOrder
    });
  });

  // Get order by invoice number
  app.get('/api/orders/:invoiceNo', (req, res) => {
    const order = ordersList.find(o => o.invoiceNo === req.params.invoiceNo || o.id === req.params.invoiceNo);
    if (!order) {
      return res.status(404).json({ success: false, message: 'অর্ডারটি পাওয়া যায়নি' });
    }
    res.json({ success: true, data: order });
  });

  // Admin: Get all orders
  app.get('/api/admin/orders', (req, res) => {
    res.json({ success: true, data: ordersList });
  });

  // Admin: Update order status
  app.patch('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const orderIndex = ordersList.findIndex(o => o.id === req.params.id || o.invoiceNo === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ success: false, message: 'অর্ডার পাওয়া যায়নি' });
    }

    ordersList[orderIndex].status = status;
    if (status === 'delivered') {
      ordersList[orderIndex].paymentStatus = 'paid';
    }

    res.json({ success: true, data: ordersList[orderIndex] });
  });

  // AI Health & Organic Food Advisor powered by Gemini
  app.post('/api/ai/advisor', async (req, res) => {
    const { question, productName } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'প্রশ্ন লিখুন' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        answer: `খাঁটি ও প্রাকৃতিক খাদ্য মানুষের শরীর সুস্থ রাখতে অপরিসীম ভূমিকা পালন করে। ${productName ? productName + ' ব্যবহারের পূর্বে কুসুম গরম পানির সাথে মিশিয়ে খেলে বা খালিপেটে সেবন করলে সর্বাধিক উপকার পাওয়া যায়।' : 'নিয়মিত অর্গানিক খাবার গ্রহণ করুন ও সুস্থ থাকুন।'}`
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an expert Bangladeshi Organic Food & Nutritionist Advisor at "Ghorer Bazar" (ঘরের বাজার). 
Respond in helpful, polite, easy-to-understand Bengali (or English if prompted in English).
User question: "${question}"
${productName ? `Related product in context: "${productName}"` : ''}

Provide a concise, practical, health-focused answer highlighting organic benefits, usage instructions, or storage tips for Bangladeshi households.`
      });

      res.json({
        success: true,
        answer: response.text || 'আপনার প্রশ্নের উত্তর দিতে সমস্যা হচ্ছে, অনুগ্রহ করে আবার চেষ্টা করুন।'
      });
    } catch (err: any) {
      console.error('Gemini error:', err);
      res.json({
        success: true,
        answer: 'খাঁটি মধুর সাথে কালিজিরা মিশিয়ে খাওয়া বা অর্গানিক ঘি কুসুম গরম ভাতে সেবন শরীরের মেটাবলিজম ও ইমিউনিটি বৃদ্ধিতে দারুন সহায়ক।'
      });
    }
  });

  // Vite middleware for dev or Static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ghorer Bazar Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
