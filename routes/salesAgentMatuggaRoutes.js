const express = require("express");
const router = express.Router();

// Route to render the add sales form
router.get("/salesAgentMatuggaDash", (req, res) => {
    res.render("salesAgentMatuga"); // Ensure "sale.pug" exists in the views folder
});
module.exports = router;
