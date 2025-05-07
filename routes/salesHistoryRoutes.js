const express = require("express");
const router = express.Router();

const Sale = require("../models/sale");
// sale History at Maganjo
router.get("/salesHistory", async (req, res) => {
  try {
    // 1. Total revenue and quantity sold
    const totalRevenueAgg = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalquantitysold: { $sum: "$quantitySold" },
          totalsale: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
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
          _id: "$produceName",
          totalQuantity: { $sum: "$quantitySold" },
          totalSales: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
          }
        }
      }
    ]);

    const productSales = productSalesAgg.map((sale) => ({
      produceName: sale._id,
      totalQuantity: sale.totalQuantity,
      totalSales: sale.totalSales
    }));

    // 3. Total credit sales
    const creditSalesAgg = await Sale.aggregate([
      { $match: { isCredit: true } },
      {
        $group: {
          _id: null,
          creditQuantitySold: { $sum: "$quantitySold" },
          creditSalesAmount: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
          }
        }
      }
    ]);

    const creditSales = creditSalesAgg[0] || {
      creditQuantitySold: 0,
      creditSalesAmount: 0
    };

    // 4. Branch-wise sales
    const branchSalesAgg = await Sale.aggregate([
      {
        $group: {
          _id: "$branchName",
          salesAmount: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
          },
          tonnageSold: { $sum: "$quantitySold" }
        }
      }
    ]);

    const branchSales = branchSalesAgg.map((branch) => ({
      branchName: branch._id,
      salesAmount: branch.salesAmount,
      tonnageSold: branch.tonnageSold
    }));

    // 5. Render the dashboard
    res.render("salesHistoryMaganjo", {
      totalRevenue, // << Corrected here
      productSales,
      creditSales,
      branchSales
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).send("Error loading dashboard data.");
  }
});

// Sales History at Matugga
router.get("/salesHistoryMatuggaDash", async (req, res) => {
  try {
    // 1. Total revenue and quantity sold
    const totalRevenueAgg = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalquantitysold: { $sum: "$quantitySold" },
          totalsale: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
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
          _id: "$produceName",
          totalQuantity: { $sum: "$quantitySold" },
          totalSales: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
          }
        }
      }
    ]);

    const productSales = productSalesAgg.map((sale) => ({
      produceName: sale._id,
      totalQuantity: sale.totalQuantity,
      totalSales: sale.totalSales
    }));

    // 3. Total credit sales
    const creditSalesAgg = await Sale.aggregate([
      { $match: { isCredit: true } },
      {
        $group: {
          _id: null,
          creditQuantitySold: { $sum: "$quantitySold" },
          creditSalesAmount: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
          }
        }
      }
    ]);

    const creditSales = creditSalesAgg[0] || {
      creditQuantitySold: 0,
      creditSalesAmount: 0
    };

    // 4. Branch-wise sales
    const branchSalesAgg = await Sale.aggregate([
      {
        $group: {
          _id: "$branchName",
          salesAmount: {
            $sum: { $multiply: ["$pricePerKg", "$quantitySold"] }
          },
          tonnageSold: { $sum: "$quantitySold" }
        }
      }
    ]);

    const branchSales = branchSalesAgg.map((branch) => ({
      branchName: branch._id,
      salesAmount: branch.salesAmount,
      tonnageSold: branch.tonnageSold
    }));

    // 5. Render the dashboard
    res.render("salesHistoryMatugga", {
      totalRevenue, // << Corrected here
      productSales,
      creditSales,
      branchSales
    });
  } catch (error) {
    console.error("Dashboard Error:", error.message);
    res.status(500).send("Error loading dashboard data.");
  }
});


module.exports = router;
