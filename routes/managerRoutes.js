const express = require("express");
const router = express.Router();

// Route to render the add sales form
router.get("/managerDash", (req, res) => {
    res.render("manager-dashboard"); // Ensure "sale.pug" exists in the views folder
});

module.exports = router;
