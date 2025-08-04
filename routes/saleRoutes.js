const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Sale = require('../models/sale');


router.get('/addSaleMaganjo', (req, res) => {
    res.render('salesAtMaganjo'); // Assumes a file like sale.pug exists in your views folder
});

// POST request: Handle the sale form submission
router.post('/addSaleMaganjo', async (req, res) => {
    try {
        // Create a new Sale document using the form data
        const sale = new Sale(req.body);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addSaleMaganjo');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
        res.status(400).render('salesAtMaganjo', { errorMessage: 'There was an issue saving the sale. Please try again.' });
    }
});

router.get('/addSaleMatugga', (req, res) => {
    res.render('salesAtMatugga'); // Assumes a file like sale.pug exists in your views folder
});

// POST request: Handle the sale form submission
router.post('/addSaleMatugga', async (req, res) => {
    try {
        // Create a new Sale document using the form data
        const sale = new Sale(req.body);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addSaleMatugga');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
        res.status(400).render('salesAtMatugga', { errorMessage: 'There was an issue saving the sale. Please try again.' });
    }
});


// sales AT manager maganjo dash
router.get('/addingSales', (req, res) => {
    res.render('salesMaganjo'); // Assumes a file like sale.pug exists in your views folder
});

// POST request: Handle the sale form submission
router.post('/addingSales', async (req, res) => {
    try {
        // Create a new Sale document using the form data
        const sale = new Sale(req.body);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addingSales');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
        res.status(400).render('salesMaganjo', { errorMessage: 'There was an issue saving the sale. Please try again.' });
    }


    // add sales at matugga
});router.get('/addSaleMaganjo', (req, res) => {
    res.render('salesAtMaganjo'); // Assumes a file like sale.pug exists in your views folder
});

// POST request: Handle the sale form submission
router.post('/addSaleMaganjo', async (req, res) => {
    try {
        // Create a new Sale document using the form data
        const sale = new Sale(req.body);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addSaleMaganjo');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
        res.status(400).render('salesAtMaganjo', { errorMessage: 'There was an issue saving the sale. Please try again.' });
    }
});

// Getting all sales from the database
router.get('/salesList', async (req, res) => {
    try {
        const items = await Sale.find();
        res.render('saleslist', { sales: items });
    } catch (error) {
        
    }
});
// Getting all sales from the database
router.get('/salesListMag', async (req, res) => {
    try {
        const items = await Sale.find();
        res.render('saleslistMaganjo', { sales: items });
    } catch (error) {
        
    }
});

// Getting all sales from the database
router.get('/salesListMat', async (req, res) => {
  try {
      const items = await Sale.find();
      res.render('saleslistMatugga', { sales: items });
  } catch (error) {
      
  }
});

// Update sale (GET request)
router.get('/updateSale/:id', async (req, res) => {
    try {
        const updateSale = await Sale.findOne({ _id: req.params.id });
        res.render('updatesale', { sale: updateSale });
    } catch (error) {
        res.status(400).send('Unable to retrieve sale for update');
    }
});

// Update sale (POST request)
router.post('/updateSale/:id', async (req, res) => {
    try {
        await Sale.findOneAndUpdate({_id:req.query.id}, req.body);
        res.redirect('/salesList'); // Redirect to the sales list after update
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(400).send('Unable to update sale');
    }
});


// UPDATE AT MAGANJO
  // GET - Load update form for Maganjo
router.get('/updateSaleMaganjo/:id', async (req, res) => {
  try {
    const updateSale = await Sale.findById(req.params.id);
    res.render('updateSaleMaganjo', { sale: updateSale });
  } catch (error) {
    res.status(400).send('Unable to retrieve sale for update');
  }
});

// POST - Handle update for Maganjo
router.post('/updateSaleMaganjo/:id', async (req, res) => {
  try {
    await Sale.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/saleListMaganjo');
  } catch (error) {
    res.status(400).send('Unable to update sale');
  }
});

// UPDATE AT MATUGGA
  // GET - Load update form for Maganjo
  router.get('/updateSaleMat/:id', async (req, res) => {
    try {
      const updateSale = await Sale.findById(req.params.id);
      res.render('updateSaleMatugga', { sale: updateSale });
    } catch (error) {
      res.status(400).send('Unable to retrieve sale for update');
    }
  });
  
  // POST - Handle update for Maganjo
  router.post('/updateSaleMat/:id', async (req, res) => {
    try {
      await Sale.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/saleListMatugga');
    } catch (error) {
      res.status(400).send('Unable to update sale');
    }
  });


  // DELETE ITEM
  router.post('/deletesaleMatugga',async(req,res)=> {
    try {
     await Sale.deleteOne({_id:req.body.id});
     res.redirect('back');
    } catch (error) {
      res.status(400).send('Unable to delete sale from the db'); 
    }
  });

  // DELETE ITEM
  router.post('/deletesaleMaganjo',async(req,res)=> {
    try {
     await Sale.deleteOne({_id:req.body.id});
     res.redirect('back');
    } catch (error) {
      res.status(400).send('Unable to delete sale from the db'); 
    }
  });

module.exports = router;
