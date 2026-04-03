const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1
    },
    size: {
      type: String,
      enum: ['S', 'M', 'L', 'XL', 'XXL'],
      default: 'M'
    },
    color: {
      type: String,
      enum: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Gray'],
      default: 'Black'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// FIXED: NO next parameter
cartSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Cart', cartSchema);