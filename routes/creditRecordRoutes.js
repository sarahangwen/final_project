const express = require('express');
const router = express.Router();

// Import your Credit model
const Credit = require('../models/Credit');

// Route to show all credit sales
router.get('/creditSalesListMaganjo', async (req, res) => {
  try {
    const credits = await Credit.find(); // Fetch all credit records from database
    res.render('creditRecordMaganjo', { credits }); 
    // ^ this 'credit-sales-list' is your Pug file name
  } catch (error) {
    console.error('Error fetching credit sales:', error);
    res.status(500).send('Server Error');
  }
});

router.get('/creditSalesListMatugga', async (req, res) => {
  try {
    const credits = await Credit.find(); // Fetch all credit records from database
    res.render('creditRecordMatugga', { credits }); 
    // ^ this 'credit-sales-list' is your Pug file name
  } catch (error) {
    console.error('Error fetching credit sales:', error);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
