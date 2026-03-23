const express = require('express');
const router = express.Router();

const Credit = require('../models/Credit'); 

const ALLOWED_BRANCHES = ['Maganjo', 'Matugga'];
const ALLOWED_PRODUCE_TYPES = ['Legume', 'Cereals'];
const ALLOWED_STATUS = ['Pending', 'Paid', 'Overdue'];

const normalizeCreditInput = (body = {}) => ({
  creditBuyerName: String(body.creditBuyerName || '').trim(),
  nationalId: String(body.nationalId || '').trim().toUpperCase(),
  location: String(body.location || '').trim(),
  contact: String(body.contact || '').trim(),
  amountDue: Number(body.amountDue),
  dueDate: String(body.dueDate || '').trim(),
  creditProduceName: String(body.creditProduceName || '').trim(),
  creditTonnage: Number(body.creditTonnage),
  creditBranchName: String(body.creditBranchName || '').trim(),
  typeOfProduce: String(body.typeOfProduce || '').trim(),
  dateOfDispatch: String(body.dateOfDispatch || '').trim(),
  creditSalesAgentName: String(body.creditSalesAgentName || '').trim(),
  status: String(body.status || 'Pending').trim()
});

const validateCreditInput = (data, expectedBranch) => {
  const errors = [];

  if (!/^[A-Za-z\s'-]{2,}$/.test(data.creditBuyerName)) {
    errors.push('Buyer name must be at least 2 characters and contain letters only.');
  }

  if (!/^C[A-Z0-9]{13}$/.test(data.nationalId)) {
    errors.push('National ID must be in a valid format.');
  }

  if (!data.location || data.location.length < 2) {
    errors.push('Location must be at least 2 characters.');
  }

  if (!/^(?:\+256|0)(7\d{8})$/.test(data.contact)) {
    errors.push('Contact must be a valid Ugandan phone number.');
  }

  if (!Number.isFinite(data.amountDue) || data.amountDue < 10000) {
    errors.push('Amount due must be at least UGX 10,000.');
  }

  if (!data.dueDate || Number.isNaN(new Date(data.dueDate).getTime())) {
    errors.push('Due date is required and must be valid.');
  }

  if (!data.creditProduceName || data.creditProduceName.length < 2) {
    errors.push('Produce name is required.');
  }

  if (!Number.isFinite(data.creditTonnage) || data.creditTonnage < 1) {
    errors.push('Tonnage must be at least 1kg.');
  }

  if (!ALLOWED_BRANCHES.includes(data.creditBranchName)) {
    errors.push('Please select a valid branch.');
  }

  if (expectedBranch && data.creditBranchName !== expectedBranch) {
    errors.push(`Branch must be ${expectedBranch} for this page.`);
  }

  if (!ALLOWED_PRODUCE_TYPES.includes(data.typeOfProduce)) {
    errors.push('Please select a valid produce type.');
  }

  if (!data.dateOfDispatch || Number.isNaN(new Date(data.dateOfDispatch).getTime())) {
    errors.push('Date of dispatch is required and must be valid.');
  }

  if (!/^[A-Za-z\s'-]{2,}$/.test(data.creditSalesAgentName)) {
    errors.push('Sales agent name must be at least 2 characters and contain letters only.');
  }

  if (!ALLOWED_STATUS.includes(data.status)) {
    errors.push('Please select a valid credit status.');
  }

  return errors;
};

const renderCreditForm = (res, view, errorMessage, validationErrors, formData) => {
  return res.status(400).render(view, {
    errorMessage,
    validationErrors,
    formData
  });
};

router.get('/creditsalesAgentMaganjoDash', (req, res) => {
  res.render('creditSalesAgentMaganjo', {
    formData: { creditBranchName: 'Maganjo', status: 'Pending' },
    validationErrors: []
  });
});

router.post('/creditsalesAgentMaganjoDash', async (req, res) => {
  const formData = normalizeCreditInput(req.body);
  const validationErrors = validateCreditInput(formData, 'Maganjo');

  try {
    if (validationErrors.length > 0) {
      return renderCreditForm(
        res,
        'creditSalesAgentMaganjo',
        'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData
      );
    }

    const credit = new Credit(formData);
    await credit.save();
    res.redirect('/creditsalesAgentMaganjoDash');
  } catch (error) {
    console.error('Error saving credit:', error);
    return renderCreditForm(
      res,
      'creditSalesAgentMaganjo',
      'There was an issue saving the credit sale. Please verify the entries and try again.',
      validationErrors,
      formData
    );
  }
});

router.get('/creditSaleMaganjo', (req, res) => {
  res.render('creditMaganjo', {
    formData: { creditBranchName: 'Maganjo', status: 'Pending' },
    validationErrors: []
  });
});

router.post('/creditSaleMaganjo', async (req, res) => {
  const formData = normalizeCreditInput(req.body);
  const validationErrors = validateCreditInput(formData, 'Maganjo');

    try {
    if (validationErrors.length > 0) {
      return renderCreditForm(
        res,
        'creditMaganjo',
        'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData
      );
    }

    const credit = new Credit(formData); 
        await credit.save(); // Await saving because save() is async
        console.log(credit);
    res.redirect('/creditSaleMaganjo');
    } catch (error) {
        console.error('Error saving credit:', error);
    return renderCreditForm(
      res,
      'creditMaganjo',
      'There was an issue saving the credit sale. Please verify the entries and try again.',
      validationErrors,
      formData
    );
    }
});

router.get('/addingCredit', (req, res) => {
  res.render('creditMatugga', {
    formData: { creditBranchName: 'Matugga', status: 'Pending' },
    validationErrors: []
  });
});

router.post('/addingCredit', async (req, res) => {
  const formData = normalizeCreditInput(req.body);
  const validationErrors = validateCreditInput(formData, 'Matugga');

    try {
    if (validationErrors.length > 0) {
      return renderCreditForm(
        res,
        'creditMatugga',
        'Please correct the highlighted errors before submitting.',
        validationErrors,
        formData
      );
    }

    const credit = new Credit(formData); 
        await credit.save(); // Await saving because save() is async
        console.log(credit);
        res.redirect('/addingCredit');
    } catch (error) {
        console.error('Error saving credit:', error);
    return renderCreditForm(
      res,
      'creditMatugga',
      'There was an issue saving the credit sale. Please verify the entries and try again.',
      validationErrors,
      formData
    );
    }
});

// Show all credit sales list
router.get('/creditList', async (req, res) => {
    try {
        const items = await Credit.find(); // Fetch all sales from the database
        res.render('creditsList', {
            credits: items // Render the sales list
        });
    } catch (error) {
        console.error('Error fetching credit:', error);
        res.status(400).send('Unable to find items in the database');
    }
});

// UPDATE AT MAGANJO
  // GET - Load update form for Maganjo
  router.get('/updateCreditMaganjo/:id', async (req, res) => {
    try {
      const updateCredit = await Credit.findById(req.params.id);
      res.render('updateCreditMaganjo', { credit: updateCredit });
    } catch (error) {
      res.status(400).send('Unable to retrieve product for update');
    }
  });
  
  // POST - Handle update for Maganjo
  router.post('/updateCreditMaganjo/:id', async (req, res) => {
    try {
      await Credit.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/creditRecordMaganjo');
    } catch (error) {
      res.status(400).send('Unable to update credit Status');
    }
  });
  
  // UPDATE AT MATUGGA
    // GET - Load update form for Maganjo
    router.get('/updateCreditMatugga/:id', async (req, res) => {
      try {
        const updateCredit = await Credit.findById(req.params.id);
        res.render('updateCreditMatugga', { credit: updateCredit });
      } catch (error) {
        res.status(400).send('Unable to retrieve credit status ');
      }
    });
    
    // POST - Handle update for Maganjo
    router.post('/updateCreditMatugga/:id', async (req, res) => {
      try {
        await Credit.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/creditRecordMatugga');
      } catch (error) {
        res.status(400).send('Unable to update credit Status');
      }
    });
  
  


module.exports = router;


