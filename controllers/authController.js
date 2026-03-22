const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

// Show login page
const showLogin = (req, res) => {
  res.render('admin/login', { error: null });
};

// Handle login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for:', username);
    
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('Admin not found');
      return res.render('admin/login', { error: 'Invalid credentials' });
    }
    
    console.log('Admin found, comparing passwords...');
    // Compare password using bcrypt directly
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }
    
    req.session.adminId = admin._id;
    req.session.adminUsername = admin.username;
    console.log('Login successful!');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log('Login error:', error);
    res.render('admin/login', { error: 'Server error' });
  }
};

// Handle logout
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

module.exports = { showLogin, login, logout };