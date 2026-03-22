const Promotion = require('../models/Promotion');
const Product = require('../models/Product');

// Show all promotions
const index = async (req, res) => {
  try {
    const promotions = await Promotion.find().populate('products');
    res.render('admin/promotions', { promotions });
  } catch (error) {
    console.log(error);
    res.redirect('/admin/dashboard');
  }
};

// Show create form
const createForm = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('admin/promotion-form', { promotion: null, products, error: null });
  } catch (error) {
    res.redirect('/admin/promotions');
  }
};

// Create promotion
const create = async (req, res) => {
  try {
    const { title, description, discountPercentage, startDate, endDate, products, image } = req.body;
    const promotion = new Promotion({
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      products: products || [],
      image
    });
    await promotion.save();
    res.redirect('/admin/promotions');
  } catch (error) {
    console.log(error);
    res.redirect('/admin/promotions/create');
  }
};

// Show edit form
const editForm = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    const products = await Product.find();
    res.render('admin/promotion-form', { promotion, products, error: null });
  } catch (error) {
    res.redirect('/admin/promotions');
  }
};

// Update promotion
const update = async (req, res) => {
  try {
    const { title, description, discountPercentage, startDate, endDate, products, image, isActive } = req.body;
    await Promotion.findByIdAndUpdate(req.params.id, {
      title,
      description,
      discountPercentage,
      startDate,
      endDate,
      products: products || [],
      image,
      isActive: isActive === 'on'
    });
    res.redirect('/admin/promotions');
  } catch (error) {
    res.redirect('/admin/promotions');
  }
};

// Delete promotion
const deletePromotion = async (req, res) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.redirect('/admin/promotions');
  } catch (error) {
    res.redirect('/admin/promotions');
  }
};

module.exports = { index, createForm, create, editForm, update, deletePromotion };