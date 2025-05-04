const express = require('express');
const router = express.Router();
const Product = require("../models/Product"); 

// Route for displaying the procurement form (GET)
router.get("/productMaganjo", async (req, res) => {
  try {
    const products = await Product.find({ branchName: 'Maganjo' });
    res.render("productMaganjo", { products });
  } catch (error) {
    console.error("Error loading products:", error);
    res.status(500).send("Unable to load products.");
  }
});

// Route for handling the form submission (POST)
router.post("/productMaganjo", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect("/productMaganjo"); // Reload the page to show updated products
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(400).render("productMaganjo", { 
      errorMessage: "There was an issue saving the product. Please try again.",
      products: [] 
    });
  }
});


// For the form (GET request)
router.get("/addProduct", (req, res) => {
  res.render("productMatugga");
});

// For form submission (POST request)
router.post('/addProduct', async (req, res) => {
  try {
      const product = new Product(req.body);
      await product.save();
      res.redirect("/productMatugga"); // Redirect to the sales list after adding a sale
  } catch (error) {
      console.error('Error saving product:', error);
      res.status(400).render("productMatugga", { errorMessage: "There was an issue saving the product. Please try again." });
  }
});

// Show all product list

router.get("/productListMaganjo", async (req, res) => {
    try {
        const items = await Product.find(); // Fetch all products from the database
        res.render("productListMaganjo", {
            products: items // Render the products list
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(400).send("Unable to find items in the database");
    }
});

router.get("/productList", async (req, res) => {
  try {
      const items = await Product.find(); // Fetch all products from the database
      res.render("productListMatugga", {
          products: items // Render the products list
      });
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(400).send("Unable to find items in the database");
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
  


module.exports=router;

