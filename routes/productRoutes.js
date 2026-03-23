const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/Product'); 

const ALLOWED_PRODUCE_NAMES = ['Beans', 'Maize Grains', 'G-Nuts', 'Soya Beans', 'Cow Peas'];
const ALLOWED_PRODUCE_TYPES = ['Legume', 'Cereals'];
const ALLOWED_BRANCHES = ['Maganjo', 'Matugga'];

const normalizeProductInput = (body = {}) => ({
  produceName: String(body.produceName || '').trim(),
  produceType: String(body.produceType || '').trim(),
  procureDate: String(body.procureDate || '').trim(),
  procureTime: String(body.procureTime || '').trim(),
  tonnage: Number(body.tonnage),
  cost: Number(body.cost),
  dealerName: String(body.dealerName || '').trim(),
  branchName: String(body.branchName || '').trim(),
  contact: String(body.contact || '').trim(),
  sellPrice: Number(body.sellPrice)
});

const validateProductInput = (data) => {
  const errors = [];

  if (!ALLOWED_PRODUCE_NAMES.includes(data.produceName)) {
    errors.push('Please select a valid produce name.');
  }

  if (!ALLOWED_PRODUCE_TYPES.includes(data.produceType)) {
    errors.push('Please select a valid produce type.');
  }

  if (!data.procureDate) {
    errors.push('Procurement date is required.');
  } else {
    const selectedDate = new Date(data.procureDate);
    if (Number.isNaN(selectedDate.getTime())) {
      errors.push('Procurement date is invalid.');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.push('Procurement date cannot be in the future.');
      }
    }
  }

  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.procureTime)) {
    errors.push('Procurement time must be a valid 24-hour time.');
  }

  if (!Number.isFinite(data.tonnage) || data.tonnage < 100) {
    errors.push('Tonnage must be a number of at least 100kg.');
  }

  if (!Number.isFinite(data.cost) || data.cost < 10000) {
    errors.push('Cost must be at least UGX 10,000.');
  }

  if (!data.dealerName || data.dealerName.length < 2) {
    errors.push('Dealer name must be at least 2 characters.');
  }

  if (!ALLOWED_BRANCHES.includes(data.branchName)) {
    errors.push('Please select a valid branch.');
  }

  if (!/^0\d{9}$/.test(data.contact)) {
    errors.push('Contact must be a valid Ugandan number (07XXXXXXXX).');
  }

  if (!Number.isFinite(data.sellPrice) || data.sellPrice < 10000) {
    errors.push('Selling price must be at least UGX 10,000.');
  }

  if (Number.isFinite(data.sellPrice) && Number.isFinite(data.cost) && data.sellPrice < data.cost) {
    errors.push('Selling price cannot be less than cost price.');
  }

  return errors;
};

// Route for displaying the procurement form (GET) at 
router.get('/productMaganjo', async (req, res) => {
  try {
    const products = await Product.find({ branchName: 'Maganjo' });
    res.render('productMaganjo', { products, formData: {}, validationErrors: [] });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).send('Unable to load products.');
  }
});

// Route for handling the form submission (POST)
router.post('/productMaganjo', async (req, res) => {
  const formData = normalizeProductInput(req.body);
  const validationErrors = validateProductInput(formData);

  try {
    if (validationErrors.length > 0) {
      const products = await Product.find({ branchName: 'Maganjo' });
      return res.status(400).render('productMaganjo', {
        errorMessage: 'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData,
        products
      });
    }

    const product = new Product(formData);
    await product.save();
    res.redirect('/productMaganjo'); // Reload the page to show updated products
  } catch (error) {
    console.error('Error saving product:', error);
    const products = await Product.find({ branchName: 'Maganjo' });
    res.status(400).render('productMaganjo', { 
      errorMessage: 'There was an issue saving the stock. Please verify your entries and try again.',
      validationErrors,
      formData,
      products
    });
  }
});


// For the form (GET request)
router.get('/addProduct', (req, res) => {
  res.render('productMatugga', { formData: {}, validationErrors: [] });
});

// For form submission (POST request)
router.post('/addProduct', async (req, res) => {
  const formData = normalizeProductInput(req.body);
  const validationErrors = validateProductInput(formData);

  try {
      if (validationErrors.length > 0) {
        return res.status(400).render('productMatugga', {
          errorMessage: 'Please correct the highlighted errors before submitting.',
          validationErrors,
          formData
        });
      }

      const product = new Product(formData);
      await product.save();
      res.redirect('/addProduct'); 
  } catch (error) {
      console.error('Error saving product:', error);
      res.status(400).render('productMatugga', {
        errorMessage: 'There was an issue saving the stock. Please verify your entries and try again.',
        validationErrors,
        formData
      });
  }
});

// Show all product list

router.get('/productListMaganjo', async (req, res) => {
    try {
        const items = await Product.find(); // Fetch all products from the database
        res.render('productListMaganjo', {
            products: items // Render the products list
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(400).send('Unable to find items in the database');
    }
});
router.get('/productList', async (req, res) => {
  try {
      const items = await Product.find(); // Fetch all products from the database
      res.render('productListMatugga', {
          products: items // Render the products list
      });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(400).send('Unable to find items in the database');
  }
});
router.get('/director-dashboard', async (req, res) => {
    try {
      const productSales = await Product.find(); // or your actual sales query
      res.render('director-dashboard', {
        items: productSales || [] // Make sure it's defined
      });
    } catch (error) {
      console.error('Error loading product sales:', error);
      res.render('director-dashboard', {
        productSales: [],
        error: 'Failed to load product sales'
      });
    }
  });
  
// Getting all products from the database
router.get('/ProductsList', async (req, res) => {
  try {
      const items = await Product.find();
      res.render('productlist', { 
        products: items 
      }); 
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(400).send('Unable to find this item in the database');
  }
});

// UPDATE AT MAGANJO
  // GET - Load update form for Maganjo
router.get('/updateProduct/:id', async (req, res) => {
  try {
    const updateProduct = await Product.findById(req.params.id);
    res.render('updateProductMaganjo', { product: updateProduct });
  } catch (error) {
    res.status(400).send('Unable to retrieve product for update');
  }
});

// POST - Handle update for Maganjo
router.post('/updateProduct/:id', async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/productListMaganjo');
  } catch (error) {
    res.status(400).send('Unable to update product');
  }
});

// UPDATE AT MATUGGA
  // GET - Load update form for Maganjo
  router.get('/updateProductMat/:id', async (req, res) => {
    try {
      const updateProduct = await Product.findById(req.params.id);
      res.render('updateProductMatugga', { product: updateProduct });
    } catch (error) {
      res.status(400).send('Unable to retrieve product for update');
    }
  });
  
  // POST - Handle update for Maganjo
  router.post('/updateProductMat/:id', async (req, res) => {
    try {
      await Product.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/productList');
    } catch (error) {
      res.status(400).send('Unable to update product');
    }
  });


  // DELETE ITEM
  router.post('/deleteProduct',async(req,res)=> {
    try {
     await Product.deleteOne({_id:req.body.id});
     res.redirect('back');
    } catch (error) {
      res.status(400).send('Unable to delete product from the db'); 
    }
  });

module.exports=router;

