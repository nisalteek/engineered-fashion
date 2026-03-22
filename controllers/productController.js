const Product = require('../models/Product');

// Show all products (admin view)
const index = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('admin/products', { products });
  } catch (error) {
    console.log(error);
    res.redirect('/admin/dashboard');
  }
};

// Show create form
const createForm = (req, res) => {
  res.render('admin/product-form', { product: null, error: null });
};

// Create product
const create = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    const product = new Product({ name, price, description, image });
    await product.save();
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error);
    res.render('admin/product-form', { product: null, error: 'Error creating product' });
  }
};

// Show edit form
const editForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/product-form', { product, error: null });
  } catch (error) {
    res.redirect('/admin/products');
  }
};

// Update product - THIS IS THE KEY FUNCTION
const update = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;
    
    console.log('🔄 Updating product ID:', req.params.id);
    console.log('   New price: $' + price);
    
    // Update the product in database
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        price: price,
        description: description,
        image: image
      },
      { new: true } // Return the updated document
    );
    
    if (updatedProduct) {
      console.log('✅ Product updated successfully!');
      console.log('   New price: $' + updatedProduct.price);
    }
    
    // Redirect back to products list
    res.redirect('/admin/products');
  } catch (error) {
    console.log('❌ Update error:', error);
    res.redirect('/admin/products');
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
  } catch (error) {
    res.redirect('/admin/products');
  }
};

module.exports = { index, createForm, create, editForm, update, deleteProduct };