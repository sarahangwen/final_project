const express = require('express');
const router = express.Router();

// Route to render the add sales form
router.get('/salesAgentMatuggaDash', (req, res) => {
    res.render('salesAgentMatugga'); // Ensure "sale.pug" exists in the views folder
});
module.exports = router;
