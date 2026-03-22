const express = require('express');
const router = express.Router();
const { isAuthenticated, isGuest } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Auth routes
router.get('/login', isGuest, authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', isAuthenticated, authController.logout);

// ============ ADMIN DASHBOARD ============
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);
    
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.render('admin/dashboard', {
      adminUsername: req.session.admin?.username || 'Admin',
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        pendingOrders
      },
      recentOrders,
      recentUsers,
      recentProducts
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.render('admin/dashboard', { 
      adminUsername: req.session.admin?.username || 'Admin',
      stats: { 
        totalOrders: 0, 
        totalUsers: 0, 
        totalProducts: 0, 
        pendingOrders: 0 
      }, 
      recentOrders: [], 
      recentUsers: [],
      recentProducts: []
    });
  }
});

// ============ PRODUCT MANAGEMENT ============
// Get all products
router.get('/products', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('admin/products', { 
      admin: req.session.admin,
      products 
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.redirect('/admin/dashboard');
  }
});

// Show create product form
router.get('/products/create', isAuthenticated, async (req, res) => {
  res.render('admin/product-form', { 
    admin: req.session.admin,
    product: null 
  });
});

// Create product
router.post('/products', isAuthenticated, async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;
    await Product.create({ 
      name, 
      price: parseFloat(price), 
      description, 
      image: image || '/images/default.jpg', 
      category, 
      stock: parseInt(stock) || 0 
    });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product error:', error);
    res.redirect('/admin/products');
  }
});

// Show edit product form
router.get('/products/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/product-form', { 
      admin: req.session.admin,
      product 
    });
  } catch (error) {
    console.error('Edit product error:', error);
    res.redirect('/admin/products');
  }
});

// Update product
router.post('/products/:id', isAuthenticated, async (req, res) => {
  try {
    const { name, price, description, image, category, stock } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
      name,
      price: parseFloat(price),
      description,
      image: image || '/images/default.jpg',
      category,
      stock: parseInt(stock) || 0
    });
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product error:', error);
    res.redirect('/admin/products');
  }
});

// Delete product
router.get('/products/:id/delete', isAuthenticated, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product error:', error);
    res.redirect('/admin/products');
  }
});

// ============ PROMOTION MANAGEMENT ============
// Get all promotions
router.get('/promotions', isAuthenticated, async (req, res) => {
  try {
    const Promotion = require('../models/Promotion');
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.render('admin/promotions', { 
      admin: req.session.admin,
      promotions 
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.redirect('/admin/dashboard');
  }
});

// Show create promotion form
router.get('/promotions/create', isAuthenticated, async (req, res) => {
  res.render('admin/promotion-form', { 
    admin: req.session.admin,
    promotion: null 
  });
});

// Create promotion
router.post('/promotions', isAuthenticated, async (req, res) => {
  try {
    const Promotion = require('../models/Promotion');
    const { title, description, discountPercentage, startDate, endDate, isActive } = req.body;
    await Promotion.create({ 
      title, 
      description, 
      discountPercentage: parseFloat(discountPercentage), 
      startDate, 
      endDate, 
      isActive: isActive === 'on' 
    });
    res.redirect('/admin/promotions');
  } catch (error) {
    console.error('Create promotion error:', error);
    res.redirect('/admin/promotions');
  }
});

// Show edit promotion form
router.get('/promotions/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const Promotion = require('../models/Promotion');
    const promotion = await Promotion.findById(req.params.id);
    res.render('admin/promotion-form', { 
      admin: req.session.admin,
      promotion 
    });
  } catch (error) {
    console.error('Edit promotion error:', error);
    res.redirect('/admin/promotions');
  }
});

// Update promotion
router.post('/promotions/:id', isAuthenticated, async (req, res) => {
  try {
    const Promotion = require('../models/Promotion');
    const { title, description, discountPercentage, startDate, endDate, isActive } = req.body;
    await Promotion.findByIdAndUpdate(req.params.id, {
      title,
      description,
      discountPercentage: parseFloat(discountPercentage),
      startDate,
      endDate,
      isActive: isActive === 'on'
    });
    res.redirect('/admin/promotions');
  } catch (error) {
    console.error('Update promotion error:', error);
    res.redirect('/admin/promotions');
  }
});

// Delete promotion
router.get('/promotions/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const Promotion = require('../models/Promotion');
    await Promotion.findByIdAndDelete(req.params.id);
    res.redirect('/admin/promotions');
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.redirect('/admin/promotions');
  }
});

// ============ ORDER MANAGEMENT ============

// Get all orders
router.get('/orders', isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.render('admin/orders', { admin: req.session.admin, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.redirect('/admin/dashboard');
  }
});

// Get single order details
router.get('/orders/:id', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone addresses');
    
    if (!order) {
      return res.redirect('/admin/orders');
    }
    
    res.render('admin/order-details', { admin: req.session.admin, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.redirect('/admin/orders');
  }
});

// Update order status (API)
router.put('/orders/:id/status', isAuthenticated, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Update status
    order.status = status;
    order.statusHistory.push({
      status: status,
      date: new Date(),
      note: note || `Status updated to ${status} by admin`
    });
    
    await order.save();
    
    res.json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Error updating order status' });
  }
});

// ============ USER MANAGEMENT ============

// Get all users
router.get('/users', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.render('admin/users', { admin: req.session.admin, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.redirect('/admin/dashboard');
  }
});

// Get single user details with orders
router.get('/users/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    
    if (!user) {
      return res.redirect('/admin/users');
    }
    
    res.render('admin/user-details', { admin: req.session.admin, user, orders });
  } catch (error) {
    console.error('Get user error:', error);
    res.redirect('/admin/users');
  }
});

// Update user role
router.put('/users/:id/role', isAuthenticated, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    
    res.json({ success: true, message: 'User role updated', user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Error updating user role' });
  }
});

// Delete user
router.delete('/users/:id', isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Order.deleteMany({ user: req.params.id });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Error deleting user' });
  }
});

module.exports = router;