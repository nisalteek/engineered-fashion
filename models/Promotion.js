const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  promoCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  minPurchase: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster queries
promotionSchema.index({ promoCode: 1 });
promotionSchema.index({ isActive: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('Promotion', promotionSchema);