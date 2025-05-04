const express = require('express');
const router = express.Router();

const Product = require("../models/Product"); 

router.get("/salesPerProductList", async (req, res) => {
    try {
      const products = await Product.find(); 
      res.render('salesPerProductMatugga', { products }); 
    } catch (error) {
        console.error("Error loading manager dashboard:", error);
        res.status(500).send("Server Error");   
    }
})

router.get("/salesPerProductListMaganjo", async (req, res) => {
  try {
    const products = await Product.find(); 
    res.render('salesPerProductMaganjo', { products }); 
  } catch (error) {
      console.error("Error loading manager dashboard:", error);
      res.status(500).send("Server Error");   
  }
})
module.exports = router;
