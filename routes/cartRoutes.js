const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/userAuth');

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
      return res.json({ success: true, items: [], total: 0 });
    }
    
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    res.json({ success: true, items: cart.items, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Error loading cart' });
  }
});

// Add to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    
    await cart.save();
    res.json({ success: true, message: 'Added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
});

// Update quantity
router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    res.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart' });
  }
});

// Remove item
router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    console.error('Remove item error:', error);
    res.status(500).json({ success: false, message: 'Error removing item' });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
});

module.exports = router;