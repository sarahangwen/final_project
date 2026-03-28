const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Sale = require('../models/Sale');

const ALLOWED_PRODUCE_NAMES = ['Maize grains', 'Soya beans', 'Cow peas', 'G-nuts', 'Maize'];
const ALLOWED_PRODUCE_TYPES = ['Legume', 'Cereals'];
const ALLOWED_BRANCHES = ['Maganjo', 'Matugga'];
const ALLOWED_PAYMENT_MODES = ['Cash', 'mobileMoney'];

const normalizeSaleInput = (body = {}) => ({
  produceName: String(body.produceName || '').trim(),
  produceType: String(body.produceType || '').trim(),
  saleDate: String(body.saleDate || '').trim(),
  saleTime: String(body.saleTime || '').trim(),
  quantitySold: Number(body.quantitySold),
  pricePerKg: Number(body.pricePerKg),
  buyerName: String(body.buyerName || '').trim(),
  buyerContact: String(body.buyerContact || '').trim(),
  branchName: String(body.branchName || '').trim(),
  paymentMode: String(body.paymentMode || '').trim()
});

const validateSaleInput = (data, expectedBranch) => {
  const errors = [];

  if (!ALLOWED_PRODUCE_NAMES.includes(data.produceName)) {
    errors.push('Please select a valid produce name.');
  }

  if (!ALLOWED_PRODUCE_TYPES.includes(data.produceType)) {
    errors.push('Please select a valid produce type.');
  }

  if (!data.saleDate) {
    errors.push('Sale date is required.');
  } else {
    const selectedDate = new Date(data.saleDate);
    if (Number.isNaN(selectedDate.getTime())) {
      errors.push('Sale date is invalid.');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.push('Sale date cannot be in the future.');
      }
    }
  }

  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.saleTime)) {
    errors.push('Sale time must be a valid 24-hour time.');
  }

  if (!Number.isFinite(data.quantitySold) || data.quantitySold < 1) {
    errors.push('Quantity sold must be at least 1kg.');
  }

  if (!Number.isFinite(data.pricePerKg) || data.pricePerKg < 1000) {
    errors.push('Price per kg must be at least UGX 1,000.');
  }

  if (!/^[A-Za-z\s'-]{2,}$/.test(data.buyerName)) {
    errors.push('Buyer name must contain only letters and be at least 2 characters.');
  }

  if (!/^(07\d{8}|2567\d{8})$/.test(data.buyerContact)) {
    errors.push('Buyer contact must be a valid Ugandan number (07XXXXXXXX or 2567XXXXXXXX).');
  }

  if (!ALLOWED_BRANCHES.includes(data.branchName)) {
    errors.push('Please select a valid branch.');
  }

  if (expectedBranch && data.branchName !== expectedBranch) {
    errors.push(`Branch must be ${expectedBranch} for this page.`);
  }

  if (!ALLOWED_PAYMENT_MODES.includes(data.paymentMode)) {
    errors.push('Please select a valid payment mode.');
  }

  return errors;
};

const renderSaleForm = (res, view, errorMessage, validationErrors, formData) => {
  return res.status(400).render(view, {
    errorMessage,
    validationErrors,
    formData
  });
};


router.get('/addSaleMaganjo', (req, res) => {
  res.render('salesAtMaganjo', {
    formData: { branchName: 'Maganjo' },
    validationErrors: []
  });
});

// POST request: Handle the sale form submission
router.post('/addSaleMaganjo', async (req, res) => {
  const formData = normalizeSaleInput(req.body);
  const validationErrors = validateSaleInput(formData, 'Maganjo');

    try {
    if (validationErrors.length > 0) {
      return renderSaleForm(
        res,
        'salesAtMaganjo',
        'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData
      );
    }

        // Create a new Sale document using the form data
    const sale = new Sale(formData);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addSaleMaganjo');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
    return renderSaleForm(
      res,
      'salesAtMaganjo',
      'There was an issue saving the sale. Please verify the entries and try again.',
      validationErrors,
      formData
    );
    }
});

router.get('/addSaleMatugga', (req, res) => {
  res.render('salesAtMatugga', {
    formData: { branchName: 'Matugga' },
    validationErrors: []
  });
});

// POST request: Handle the sale form submission
router.post('/addSaleMatugga', async (req, res) => {
  const formData = normalizeSaleInput(req.body);
  const validationErrors = validateSaleInput(formData, 'Matugga');

    try {
    if (validationErrors.length > 0) {
      return renderSaleForm(
        res,
        'salesAtMatugga',
        'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData
      );
    }

        // Create a new Sale document using the form data
    const sale = new Sale(formData);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addSaleMatugga');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
    return renderSaleForm(
      res,
      'salesAtMatugga',
      'There was an issue saving the sale. Please verify the entries and try again.',
      validationErrors,
      formData
    );
    }
});


// sales AT manager maganjo dash
router.get('/addingSales', (req, res) => {
  res.render('salesMaganjo', {
    formData: { branchName: 'Maganjo' },
    validationErrors: []
  });
});

// POST request: Handle the sale form submission
router.post('/addingSales', async (req, res) => {
  const formData = normalizeSaleInput(req.body);
  const validationErrors = validateSaleInput(formData, 'Maganjo');

    try {
    if (validationErrors.length > 0) {
      return renderSaleForm(
        res,
        'salesMaganjo',
        'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData
      );
    }

        // Create a new Sale document using the form data
    const sale = new Sale(formData);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect('/addingSales');
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
    return renderSaleForm(
      res,
      'salesMaganjo',
      'There was an issue saving the sale. Please verify the entries and try again.',
      validationErrors,
      formData
    );
    }


    // add sales at matugga
  });

// Getting all sales from the database
router.get('/salesList', async (req, res) => {
    try {
        const items = await Sale.find();
    res.render('salesList', { sales: items });
    } catch (error) {
    res.status(500).send('Unable to fetch sales records.');
    }
});
// Getting all sales from the database
router.get('/salesListMag', async (req, res) => {
    try {
    const items = await Sale.find({ branchName: 'Maganjo' });
    res.render('salesListMaganjo', { sales: items });
    } catch (error) {
    res.status(500).send('Unable to fetch Maganjo sales records.');
    }
});

// Getting all sales from the database
router.get('/salesListMat', async (req, res) => {
  try {
    const items = await Sale.find({ branchName: 'Matugga' });
    res.render('salesListMatugga', { sales: items });
  } catch (error) {
    res.status(500).send('Unable to fetch Matugga sales records.');
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
    await Sale.findByIdAndUpdate(req.params.id, req.body);
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
    res.redirect('/salesListMag');
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
      res.redirect('/salesListMat');
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
