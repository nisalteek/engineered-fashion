require('dotenv').config();
const mongoose = require('mongoose');
const Promotion = require('./models/Promotion');

async function addPromoCode() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Delete existing promotions
    await Promotion.deleteMany({});
    console.log('📦 Cleared existing promotions');
    
    // Add new promo codes
    const promotions = [
      {
        title: "Welcome Offer",
        description: "20% off your first purchase",
        discountPercentage: 20,
        promoCode: "WELCOME20",
        startDate: new Date('2024-01-01'),
        endDate: new Date('2027-12-31'),
        minPurchase: 0,
        maxDiscount: 100,
        isActive: true
      },
      {
        title: "Summer Sale",
        description: "50% off on selected items",
        discountPercentage: 50,
        promoCode: "SUMMER50",
        startDate: new Date('2024-06-01'),
        endDate: new Date('2027-08-31'),
        minPurchase: 100,
        maxDiscount: 100,
        isActive: true
      },
      {
        title: "Save 10",
        description: "10% off everything",
        discountPercentage: 10,
        promoCode: "SAVE10",
        startDate: new Date('2024-01-01'),
        endDate: new Date('2027-12-31'),
        minPurchase: 0,
        isActive: true
      },
      {
        title: "Flash Sale",
        description: "20% off flash sale",
        discountPercentage: 20,
        promoCode: "FLASH20",
        startDate: new Date('2024-01-01'),
        endDate: new Date('2027-12-31'),
        minPurchase: 50,
        maxDiscount: 50,
        isActive: true
      }
    ];
    
    const result = await Promotion.insertMany(promotions);
    console.log('✅ Promo codes added successfully!');
    console.log('\n📋 Available Promo Codes:');
    result.forEach(p => {
      console.log(`   • ${p.promoCode} - ${p.discountPercentage}% off` + 
                  (p.minPurchase > 0 ? ` (Min. purchase $${p.minPurchase})` : ''));
    });
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addPromoCode();