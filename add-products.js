require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    name: "Smart Jacket",
    description: "Temperature regulating smart jacket with built-in heating",
    price: 199.99,
    image: "/images/p1.jpg",
    category: "Jackets",
    stock: 50
  },
  {
    name: "NeoFit T-Shirt",
    description: "Breathable smart t-shirt with heart rate monitoring",
    price: 49.99,
    image: "/images/p2.jpg",
    category: "Shirts",
    stock: 100
  },
  {
    name: "Tech Hoodie",
    description: "Connected hoodie with smart features and LED display",
    price: 89.99,
    image: "/images/p3.jpg",
    category: "Hoodies",
    stock: 75
  }
];

async function addProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing products (optional)
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Add new products
    await Product.insertMany(products);
    console.log('✅ Products added successfully!');
    console.log('Added:', products.map(p => p.name).join(', '));
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addProducts();