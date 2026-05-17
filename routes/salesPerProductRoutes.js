const express = require('express');
const router = express.Router();

const Product = require('../models/Product');

const getMaganjoSidebarItems = () => [
  { href: '/productListMaganjo', label: 'Product List' },
  { href: '/salesListMag', label: 'View Sales List' },
  { href: '/salesPerProductListMaganjo', label: 'Sales Per Product' },
  { href: '/creditSalesListMaganjo', label: 'Credit Sales Management' },
  { href: '/logout', label: 'Logout', isLogout: true, class: 'logout-button' }
];

const getMatuggaSidebarItems = () => [
  { href: '/productListMatugga', label: 'Product List' },
  { href: '/salesListMatugga', label: 'View Sales List' },
  { href: '/salesPerProductListMatugga', label: 'Sales Per Product' },
  { href: '/creditSalesAgentMatuggaDash', label: 'Credit Sales Management' },
  { href: '/logout', label: 'Logout', isLogout: true, class: 'logout-button' }
];

router.get('/salesPerProductList', async (req, res) => {
    try {
      const products = await Product.find({ branchName: 'Matugga' }); 
      res.render('salesPerProductMatugga', { 
        products,
        pageTitle: 'Sales Per Product - Matugga',
        pageHeader: 'Sales Per Product',
        pageSubtitle: 'Detailed sales performance by product',
        branchName: 'Matugga Branch',
        sidebarItems: getMatuggaSidebarItems()
      }); 
    } catch (error) {
        console.error('Error loading sales per product:', error);
        res.status(500).send('Server Error');   
    }
});

router.get('/salesPerProductListMaganjo', async (req, res) => {
  try {
    const products = await Product.find({ branchName: 'Maganjo' }); 
    res.render('salesPerProductMaganjo', { 
      products,
      pageTitle: 'Sales Per Product - Maganjo',
      pageHeader: 'Sales Per Product',
      pageSubtitle: 'Detailed sales performance by product',
      branchName: 'Maganjo Branch',
      sidebarItems: getMaganjoSidebarItems()
    }); 
  } catch (error) {
      console.error('Error loading sales per product:', error);
      res.status(500).send('Server Error');   
  }
});

module.exports = router;
