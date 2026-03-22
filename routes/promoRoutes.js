const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');

// Validate promo code
router.post('/validate', async (req, res) => {
  try {
    console.log('🔍 Validating promo code:', req.body);
    const { code, subtotal } = req.body;
    const promoCode = code.toUpperCase();
    
    const now = new Date();
    
    const promotion = await Promotion.findOne({
      promoCode: promoCode,
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    
    console.log('📦 Found promotion:', promotion);
    
    if (!promotion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid or expired promo code' 
      });
    }
    
    // Check minimum purchase
    if (promotion.minPurchase && promotion.minPurchase > 0 && subtotal < promotion.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of $${promotion.minPurchase} required for this promo code` 
      });
    }
    
    // Calculate discount
    let discountAmount = (subtotal * promotion.discountPercentage) / 100;
    
    // Apply max discount limit
    if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
      discountAmount = promotion.maxDiscount;
    }
    
    const newTotal = subtotal - discountAmount;
    
    res.json({
      success: true,
      promotion: {
        code: promotion.promoCode,
        discountPercentage: promotion.discountPercentage,
        discountAmount: discountAmount.toFixed(2),
        newTotal: newTotal.toFixed(2),
        message: `${promotion.discountPercentage}% discount applied!`
      }
    });
  } catch (error) {
    console.error('❌ Promo validation error:', error);
    res.status(500).json({ success: false, message: 'Error validating promo code: ' + error.message });
  }
});

module.exports = router;