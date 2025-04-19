const express = require('express');
const router = express.Router();
const Product = require("../models/Product"); 

// For the form (GET request)
router.get("/addProduct", (req, res) => {
    res.render("product");
});

// For form submission (POST request)
router.post('/addProduct', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.redirect("/addProduct"); // Redirect to the sales list after adding a sale
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(400).render("product", { errorMessage: "There was an issue saving the product. Please try again." });
    }
});

// Show all product list

router.get("/productList", async (req, res) => {
    try {
        const items = await Product.find(); // Fetch all products from the database
        res.render("productList", {
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

