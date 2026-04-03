const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: '/images/default.jpg'
  },
  description: {
    type: String,
    default: 'Smart clothing powered by innovation'
  },
  category: {
    type: String,
    default: 'General'
  },
  stock: {
    type: Number,
    default: 10
  },
  sizes: [{
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL'],
    default: ['S', 'M', 'L', 'XL']
  }],
  colors: [{
    type: String,
    enum: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Gray'],
    default: ['Black', 'White']
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);