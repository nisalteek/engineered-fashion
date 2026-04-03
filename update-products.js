require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function updateProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Update all products to add sizes and colors
    const result = await Product.updateMany(
      {},
      {
        $set: {
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Black', 'White', 'Red', 'Blue']
        }
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} products`);
    
    // Verify the update
    const products = await Product.find();
    console.log('\n📋 Products now have:');
    products.forEach(p => {
      console.log(`   ${p.name}: Sizes: ${p.sizes ? p.sizes.join(', ') : 'None'} | Colors: ${p.colors ? p.colors.join(', ') : 'None'}`);
    });
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateProducts();