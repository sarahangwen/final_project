const express = require('express');
const router = express.Router();

const Sale = require('../models/sale');
const Credit = require('../models/Credit');

// Route to render the sales agent dashboard for Maganjo
router.get('/salesAgentMaganjoDash', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Fetch today's total sales
        const totalSalesTodayResult = await Sale.aggregate([
            { $match: { saleDate: { $gte: today, $lt: tomorrow }, branch: 'Maganjo' } }, // Assuming branch field exists
            { $group: { _id: null, total: { $sum: { $multiply: ['$quantitySold', '$pricePerKg'] } } } }
        ]);
        const totalSalesToday = totalSalesTodayResult[0]?.total || 0;

        // Fetch outstanding credits
        const outstandingCreditResult = await Credit.aggregate([
            { $match: { status: { $ne: 'Paid' }, branch: 'Maganjo' } }, // Filter to Maganjo branch
            { $group: { _id: null, total: { $sum: { $multiply: ['$quantitySold', '$pricePerKg'] } } } }
        ]);
        const outstandingCredits = outstandingCreditResult[0]?.total || 0;

        // Render the dashboard view
        res.render('salesAgentMaganjo', {
            totalSalesToday,
            outstandingCredits
        });

    } catch (error) {
        console.error('Error loading sales agent dashboard:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
