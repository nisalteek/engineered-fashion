require('dotenv').config();
const mongoose = require('mongoose');
const Promotion = require('./models/Promotion');

const promotions = [
  {
    title: "20% OFF with Bank Cards 💳",
    description: "Get 20% discount when paying with any bank card",
    discountPercentage: 20,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    image: "/images/promo-bank.jpg"
  },
  {
    title: "Summer Sale! ☀️",
    description: "Up to 50% off on selected smart wear",
    discountPercentage: 50,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    isActive: true,
    image: "/images/promo-summer.jpg"
  },
  {
    title: "New Customer Offer 🎁",
    description: "15% off on your first purchase + Free Shipping",
    discountPercentage: 15,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    isActive: true,
    image: "/images/promo-new.jpg"
  }
];

async function addPromotions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Promotion.deleteMany({});
    await Promotion.insertMany(promotions);
    console.log('✅ Promotions added successfully!');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addPromotions();