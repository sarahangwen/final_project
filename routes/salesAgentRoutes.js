const express = require("express");
const router = express.Router();

// Route to render the add sales form
router.get("/salesAgentDash", (req, res) => {
    res.render("sales-agent-dashboard"); // Ensure "sale.pug" exists in the views folder
});
module.exports = router;
