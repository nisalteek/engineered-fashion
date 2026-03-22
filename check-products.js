require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const checkProducts = async () => {
  try {
    await connectDB();
    
    const products = await Product.find();
    
    console.log('\n═══════════════════════════════════════');
    console.log('     CURRENT PRODUCTS IN DATABASE');
    console.log('═══════════════════════════════════════\n');
    
    if (products.length === 0) {
      console.log('❌ NO PRODUCTS FOUND!');
      console.log('\nRun: node add-products.js to add products\n');
    } else {
      products.forEach((product, i) => {
        console.log(`${i + 1}. ${product.name}`);
        console.log(`   ID: ${product._id}`);
        console.log(`   Price: $${product.price}`);
        console.log(`   Image: ${product.image}`);
        console.log('   ────────────────────────────────');
      });
      console.log(`\n✅ Total Products: ${products.length}`);
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkProducts();