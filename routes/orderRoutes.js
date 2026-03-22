const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect, authorize } = require('../middleware/userAuth');

// Create order
router.post('/create', protect, async (req, res) => {
  try {
    console.log('📦 Creating order for user:', req.user.id);
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      console.log('❌ Cart is empty');
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    console.log('📦 Cart has', cart.items.length, 'items');
    
    let itemsPrice = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product.price;
      itemsPrice += price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        price: price,
        quantity: item.quantity,
        image: item.product.image
      };
    });
    
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;
    
    console.log('💰 Order total:', totalPrice);
    
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      statusHistory: [{ status: 'pending', date: new Date(), note: 'Order placed' }]
    });
    
    console.log('✅ Order created successfully, ID:', order._id);
    
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({ success: false, message: 'Error creating order: ' + error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    console.log('📋 Fetching orders for user:', req.user.id);
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log(`✅ Found ${orders.length} orders`);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('❌ Get orders error:', error);
    res.status(500).json({ success: false, message: 'Error loading orders: ' + error.message });
  }
});

// Cancel order (user)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    console.log('🔵 Cancel order request received');
    console.log('Order ID:', req.params.id);
    console.log('User ID:', req.user.id);
    console.log('Reason:', req.body.reason);
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      console.log('❌ Order not found');
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    console.log('✅ Order found');
    console.log('Order status:', order.status);
    console.log('Order user:', order.user.toString());
    console.log('Request user:', req.user.id);
    
    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      console.log('❌ User not authorized - order belongs to different user');
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    // Check if order can be cancelled
    if (order.status !== 'pending') {
      console.log(`❌ Order cannot be cancelled. Current status: ${order.status}`);
      return res.status(400).json({ 
        success: false, 
        message: `Order cannot be cancelled. Current status: ${order.status}` 
      });
    }
    
    console.log('✅ Order can be cancelled');
    
    // Cancel the order
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      date: new Date(),
      note: req.body.reason || 'Cancelled by user'
    });
    
    await order.save();
    console.log('✅ Order cancelled successfully');
    
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('❌ Cancel order error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ success: false, message: 'Error cancelling order: ' + error.message });
  }
});
// Create order
router.post('/create', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    let itemsPrice = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product.price;
      itemsPrice += price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        price: price,
        quantity: item.quantity,
        image: item.product.image
      };
    });
    
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;
    
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      itemsPrice,
      shippingPrice,
      totalPrice,
      statusHistory: [{ status: 'pending', date: new Date(), note: 'Order placed' }]
    });
    
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Error creating order: ' + error.message });
  }
});
// Get single order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Error loading order' });
  }
});
// Create order
router.post('/create', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, promoCode, discountAmount: appliedDiscount } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    let itemsPrice = 0;
    const orderItems = cart.items.map(item => {
      const price = item.product.price;
      itemsPrice += price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        price: price,
        quantity: item.quantity,
        image: item.product.image
      };
    });
    
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    
    // Calculate discount
    let discountAmount = appliedDiscount || 0;
    let finalTotal = itemsPrice + shippingPrice - discountAmount;
    
    // Find promo details if promo code applied
    let promoDetails = null;
    if (promoCode) {
      const Promotion = require('../models/Promotion');
      promoDetails = await Promotion.findOne({ promoCode: promoCode.toUpperCase() });
    }
    
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      promoCode: promoCode || null,
      discountAmount: discountAmount,
      discountPercentage: promoDetails ? promoDetails.discountPercentage : 0,
      itemsPrice,
      shippingPrice,
      totalPrice: finalTotal,
      statusHistory: [{ status: 'pending', date: new Date(), note: 'Order placed' }]
    });
    
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Error creating order: ' + error.message });
  }
});
module.exports = router;