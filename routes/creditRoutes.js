const express = require("express");
const router = express.Router();

const Credit = require("../models/Credit"); 

router.get("/creditsalesAgentMaganjoDash", (req, res) => {
    res.render("creditsalesAgentMaganjo");
});

router.post("/creditsalesAgentMaganjoDash", async (req, res) => {
    try {
        const credit = new Credit(req.body); 
        await credit.save(); // Await saving because save() is async
        console.log(credit);
        res.redirect("/creditsalesAgentMaganjoDash");
    } catch (error) {
        console.error('Error saving credit:', error);
        res.status(400).render("salesAgentMaganjo", { errors: error.errors });
    }
});

router.get("/creditSaleMaganjo", (req, res) => {
    res.render("creditMaganjo");
});

router.post("/creditSaleMaganjo", async (req, res) => {
    try {
        const credit = new Credit(req.body); 
        await credit.save(); // Await saving because save() is async
        console.log(credit);
        res.redirect("/");
    } catch (error) {
        console.error('Error saving credit:', error);
        res.status(400).render("creditMaganjo", { errors: error.errors });
    }
});

router.get("/addingCredit", (req, res) => {
    res.render("creditMatugga");
});

router.post("/addingCredit", async (req, res) => {
    try {
        const credit = new Credit(req.body); 
        await credit.save(); // Await saving because save() is async
        console.log(credit);
        res.redirect("/addingCredit");
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

// UPDATE AT MAGANJO
  // GET - Load update form for Maganjo
  router.get('/updateCreditMaganjo/:id', async (req, res) => {
    try {
      const updateCredit = await Credit.findById(req.params.id);
      res.render("updateCredtMaganjo", { credit: updateCredit });
    } catch (error) {
      res.status(400).send("Unable to retrieve product for update");
    }
  });
  
  // POST - Handle update for Maganjo
  router.post('/updateCreditMaganjo/:id', async (req, res) => {
    try {
      await Credit.findByIdAndUpdate(req.params.id, req.body);
      res.redirect("/creditRecordMaganjo");
    } catch (error) {
      res.status(400).send("Unable to update credit Status");
    }
  });
  
  // UPDATE AT MATUGGA
    // GET - Load update form for Maganjo
    router.get('/updateCreditMatugga/:id', async (req, res) => {
      try {
        const updateCredit = await Credit.findById(req.params.id);
        res.render("updateCreditMatugga", { product: updateCredit });
      } catch (error) {
        res.status(400).send("Unable to retrieve credit status ");
      }
    });
    
    // POST - Handle update for Maganjo
    router.post('/updateCreditMatugga/:id', async (req, res) => {
      try {
        await Credit.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/creditRecordMatugga");
      } catch (error) {
        res.status(400).send("Unable to update credit Status");
      }
    });
  
  


module.exports = router;


