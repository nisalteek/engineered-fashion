require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

const createAdmin = async () => {
  try {
    await connectDB();
    
    console.log('Checking if admin exists...');
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📝 Login Details:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   Email: admin@smartwear.com');
      await mongoose.disconnect();
      process.exit(0);
    }
    
    console.log('Creating new admin...');
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // Create new admin with hashed password
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@smartwear.com'
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('📝 Login Details:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Email: admin@smartwear.com');
    
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 11000) {
      console.log('⚠️  Admin already exists (duplicate key error)');
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();