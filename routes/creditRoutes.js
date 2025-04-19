const express = require("express");
const router = express.Router();

const Credit = require("../models/Credit"); 

router.get("/addingCredit", (req, res) => {
    res.render("credit");
});

router.post("/addingCredit", async (req, res) => {
    try {
        const credit = new Credit(req.body); 
        await credit.save(); // Await saving because save() is async
        console.log(credit);
        res.redirect("/credit/addingCredit");
    } catch (error) {
        console.error('Error saving credit:', error);
        res.status(400).render("credit", { errors: error.errors });
    }
});

// Show all credit sales list
router.get("/creditList", async (req, res) => {
    try {
        const items = await Credit.find(); // Fetch all sales from the database
        res.render("creditsList", {
            credits: items // Render the sales list
        });
    } catch (error) {
        console.error('Error fetching credit:', error);
        res.status(400).send("Unable to find items in the database");
    }
});

module.exports = router;


