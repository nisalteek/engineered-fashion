const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const Order = require('../models/Order');
const User = require('../models/User');

const dashboard = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const promotionCount = await Promotion.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.render('admin/dashboard', {
      adminUsername: req.session.admin.username,
      stats: {
        totalOrders,
        totalUsers,
        totalProducts: productCount,
        pendingOrders
      },
      recentProducts,
      recentOrders,
      recentUsers
    });
  } catch (error) {
    console.log('Dashboard error:', error);
    res.render('admin/dashboard', { 
      adminUsername: req.session.admin.username,
      stats: {
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        pendingOrders: 0
      },
      recentProducts: [],
      recentOrders: [],
      recentUsers: []
    });
  }
};

module.exports = { dashboard };