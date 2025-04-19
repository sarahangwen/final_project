const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Sale = require("../models/Sale");

router.get("/addSale", (req, res) => {
    res.render("sale"); // Assumes a file like sale.pug exists in your views folder
});

// POST request: Handle the sale form submission
router.post('/addSale', async (req, res) => {
    try {
        // Create a new Sale document using the form data
        const sale = new Sale(req.body);
        // Save the sale to the database
        await sale.save();
        // Redirect back to the sale form (or another route if desired)
        res.redirect("/sale/addSale");
    } catch (error) {
        console.error('Error saving sale:', error);
        // Render the sale form with an error message if saving fails
        res.status(400).render("sale", { errorMessage: "There was an issue saving the sale. Please try again." });
    }
});

// Getting all sales from the database
router.get("/salesList", async (req, res) => {
    try {
        const items = await Sale.find();
        res.render("saleslist", { sales: items });
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(400).send("Unable to find items in the database");
    }
});

// Update sale (GET request)
router.get('/updateSale/:id', async (req, res) => {
    try {
        const updateSale = await Sale.findOne({ _id: req.params.id });
        res.render("updatesale", { sale: updateSale });
    } catch (error) {
        res.status(400).send("Unable to retrieve sale for update");
    }
});

// Update sale (POST request)
router.post('/updateSale/:id', async (req, res) => {
    try {
        await Sale.findOneAndUpdate({_id:req.query.id}, req.body)
        res.redirect("/salesList"); // Redirect to the sales list after update
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(400).send("Unable to update sale");
    }
});



module.exports = router;
