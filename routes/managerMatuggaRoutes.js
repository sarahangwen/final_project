const express = require("express");
const router = express.Router();

// Import models correctly
const Sale = require("../models/sale");
const Credit = require("../models/Credit");
const Product = require("../models/Product");

router.get("/managerMatuggaDash", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Fetch sales and revenue
    const totalSalesTodayResult = await Sale.aggregate([
      { $match: { saleDate: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$quantitySold", "$pricePerKg"] } } } }
    ]);
    const totalSalesToday = totalSalesTodayResult[0]?.total || 0;

    const totalRevenueResult = await Sale.aggregate([
      { $match: { saleDate: { $gte: monthStart, $lt: tomorrow } } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$quantitySold", "$pricePerKg"] } } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    // Fetch outstanding credits
    const outstandingCreditResult = await Credit.aggregate([
      { $match: { status: { $ne: "Paid" } } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$quantitySold", "$pricePerKg"] } } } }
    ]);
    const outstandingCredits = outstandingCreditResult[0]?.total || 0;

    // Fetch low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
    const lowStockCount = lowStockProducts.length;

    // Fetch all credits
    const credits = await Credit.find();

    // Fetch all sales
    const sales = await Sale.find();

    // Fetch all products
    const productsFromDB = await Product.find(); // renamed for clarity

    // Aggregate sales per product (to know how much sold per produceName)
    const salesPerProduct = await Sale.aggregate([
      {
        $group: {
          _id: "$produceName",
          totalSold: { $sum: "$quantitySold" }
        }
      }
    ]);

    // Create a lookup dictionary for fast access
    const soldLookup = {};
    salesPerProduct.forEach(sale => {
      soldLookup[sale._id] = sale.totalSold;
    });

    // Create a new products array with remaining stock
    const products = productsFromDB.map(product => {
      const totalSold = soldLookup[product.produceName] || 0;  // assume 'name' field in Product matches Sale.produceName
      const remainingStock = product.stock - totalSold;

      return {
        ...product.toObject(),
        totalSold,
        remainingStock
      };
    });

    // Group and sum sales per unique product name
const salesAggregation = {};

products.forEach(product => {
  if (salesAggregation[product.produceName]) {
    salesAggregation[product.produceName] += product.totalSold;
  } else {
    salesAggregation[product.produceName] = product.totalSold;
  }
});

// Create final topSellingData array
const topSellingData = Object.keys(salesAggregation).map(produceName => ({
  label: produceName,
  value: salesAggregation[produceName]
}));


    // Check if the pie chart data is valid (i.e., not empty)
    if (topSellingData.length === 0) {
      console.log("No top selling products data available.");
    }

    // Log data for debugging
    console.log('Top Selling Data:', topSellingData);

    // Render the dashboard
    res.render("managerMatugga", {
      totalSalesToday,
      totalRevenue,
      outstandingCredits,
      lowStockCount,
      credits,
      products,   // now with remainingStock
      sales,
      salesPerformanceData: totalSalesToday,
      topSellingData
    });
  } catch (error) {
    console.error("Error loading manager dashboard:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
