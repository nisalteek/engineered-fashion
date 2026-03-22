require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session configuration
app.use(session({
  secret: 'your-secret-key-change-this-to-something-secure',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// Make session available in views
app.use((req, res, next) => {
  res.locals.admin = req.session.adminId ? { username: req.session.adminUsername } : null;
  res.locals.user = req.session.user || null;
  next();
});

// view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static(path.join(__dirname, 'public')));

// ============ API ROUTES ============
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const promoRoutes = require('./routes/promoRoutes');  // ADD THIS LINE

app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promo', promoRoutes);  // ADD THIS LINE

// ============ ADMIN ROUTES ============
app.use('/admin', require('./routes/adminRoutes'));

// ============ PUBLIC ROUTES ============
app.get('/', async (req, res) => {
  try {
    const products = await Product.find().limit(3);
    const Promotion = require('./models/Promotion');
    const promotions = await Promotion.find({ 
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).sort({ discountPercentage: -1 });
    
    res.render('pages/index', { 
      products: products, 
      promotions: promotions,
      user: req.session.user || null
    });
  } catch (error) {
    console.log('Homepage error:', error);
    res.render('pages/index', { products: [], promotions: [], user: null });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('pages/products', { products, user: req.session.user || null });
  } catch (error) {
    console.log(error);
    res.render('pages/products', { products: [], user: null });
  }
});

app.get('/promotions', async (req, res) => {
  try {
    const Promotion = require('./models/Promotion');
    const promotions = await Promotion.find({ isActive: true });
    res.render('pages/promotions', { promotions, user: req.session.user || null });
  } catch (error) {
    res.render('pages/promotions', { promotions: [], user: null });
  }
});

// ============ USER AUTH PAGES ============
// User login page
app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('pages/login', { error: null, success: null });
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('pages/register', { error: null, success: null });
});

// ============ CART & CHECKOUT PAGES ============
app.get('/cart', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('pages/cart', { user: req.session.user });
});

app.get('/checkout', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('pages/checkout', { user: req.session.user });
});

app.get('/my-orders', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  const Order = require('./models/Order');
  const orders = await Order.find({ user: req.session.user.id }).sort({ createdAt: -1 });
  res.render('pages/my-orders', { user: req.session.user, orders });
});

// Order details page
app.get('/order/:id', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  
  const Order = require('./models/Order');
  const order = await Order.findById(req.params.id);
  
  if (!order || order.user.toString() !== req.session.user.id) {
    return res.redirect('/my-orders');
  }
  
  res.render('pages/order-details', { user: req.session.user, order });
});

// ============ LOGOUT ============
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// ============ SERVER ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});