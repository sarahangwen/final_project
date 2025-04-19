const express = require("express");
const router = express.Router();

const Sale = require("../models/Sale");


// Route to render the add sales form
router.get("/directorDash", async(req, res) => {
    try {
       let totalRevenue = await Sale.aggregate([
        
        {$group:{_id:null,
            totalquantitysold:{$sum:"$quantitySold"},
            totalsale:{$sum:{$multiply:["$pricePerKg","$quantitySold"]}}
        }}
       ])
       totalRevenue=totalRevenue[0] ?? {totalquantitysold:0,totalsale:0};
       res.render("director-dashboard",{
        totalRevenue
       });
    } catch (error) {
    res.status(400).send("Unable to find item from the db")
    console.error("aggregation error:",error.message)
    }
    
});

module.exports = router;

