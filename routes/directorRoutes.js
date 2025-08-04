const express = require('express');
const router = express.Router();

const Sale = require('../models/sale');
const Credit = require('../models/Credit');

router.get('/directorDash', async (req, res) => {
  try {
    // 1. Total revenue and quantity sold
    const totalRevenueAgg = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalquantitysold: { $sum: '$quantitySold' },
          totalsale: {
            $sum: { $multiply: ['$pricePerKg', '$quantitySold'] }
          }
        }
      }
    ]);
    const totalRevenue = totalRevenueAgg[0] || {
      totalquantitysold: 0,
      totalsale: 0
    };

    // 2. Total sales per product
    const productSalesAgg = await Sale.aggregate([
      {
        $group: {
          _id: '$produceName',
          totalQuantity: { $sum: '$quantitySold' },
          totalSales: {
            $sum: { $multiply: ['$pricePerKg', '$quantitySold'] }
          }
        }
      }
    ]);
    const productSales = productSalesAgg.map((sale) => ({
      produceName: sale._id,
      totalQuantity: sale.totalQuantity,
      totalSales: sale.totalSales
    }));

    // 3. Branch-wise sales
    const branchSalesAgg = await Sale.aggregate([
      {
        $group: {
          _id: '$branchName',
          salesAmount: {
            $sum: { $multiply: ['$pricePerKg', '$quantitySold'] }
          },
          tonnageSold: { $sum: '$quantitySold' }
        }
      }
    ]);
    const branchSales = branchSalesAgg.map((branch) => ({
      branchName: branch._id,
      salesAmount: branch.salesAmount,
      tonnageSold: branch.tonnageSold
    }));

    // 4. Fetch outstanding credit sales (based on creditTonnage and amountDue)
    const creditSalesAgg = await Credit.aggregate([
      { $match: { status: { $ne: 'Paid' } } },
      {
        $group: {
          _id: null,
          totalCreditAmount: { $sum: '$amountDue' },
          totalCreditTonnage: { $sum: '$creditTonnage' }
        }
      }
    ]);

    const totalCreditAmount = creditSalesAgg[0]?.totalCreditAmount || 0;
    const totalCreditTonnage = creditSalesAgg[0]?.totalCreditTonnage || 0;

    // 5. Render the dashboard
    res.render('director-dashboard', {
      totalRevenue,
      productSales,
      branchSales,
      totalCreditAmount,
      totalCreditTonnage
    });

  } catch (error) {
    console.error('Dashboard Error:', error.message);
    res.status(500).send('Error loading dashboard data.');
  }
});

module.exports = router;
