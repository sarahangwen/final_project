const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import models
const SignUp = require("../models/Signup");

// Render signup form
router.get("/signingup", (req, res) => {
    res.render("signUp"); // Render signup view
});

// Handle signup logic
router.post("/signingup", async (req, res) => {
    try {
        console.log("Signup Request Body:", req.body);

        const { email, password } = req.body;
        const existingUser = await SignUp.findOne({ email });

        if (existingUser) {
            return res.status(400).send("Email already registered. Please use a different one.");
        }

        const user = new SignUp(req.body);
        await SignUp.register(user, String(password));  // Ensures password is string

        console.log("New user registered:", user);
        res.redirect("/login");

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(400).render("SignUp", { error: "Failed to register. Please try again." });
    }
});

// Render login form
router.get("/login", (req, res) => {
    res.render("login");
});

// Handle login
router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    console.log("Login details:", req.body);
    req.session.user = req.user;

    if (req.user.role === "managerMaganjo") {
        res.redirect("/managerMaganjoDash");
    } else if (req.user.role === "managerMatugga") {
        res.redirect("/managerMatuggaDash");
    } else if (req.user.role === "salesAgentMaganjo") {
        res.redirect("/salesAgentMaganjoDash");
    } else if (req.user.role === "salesAgentMatugga") {
        res.redirect("/salesAgentMatuggaDash");
    } else if (req.user.role === "director") {
        res.redirect("/directorDash");
    } else {
        res.send("You do not have any role in the system");
    }
});

    


// Logout route
router.get("/logout", (req, res) => {  
    req.logout((err) => {
        if (err) {
            return res.status(500).send("Logout error: " + err.message);
        }
        req.session.destroy(() => {
            res.redirect("/");
        });
    });
});

module.exports = router;
