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
        res.status(400).render("signUp", { error: "Failed to register. Please try again." });
    }
});

// Render login form
router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }), (req, res) => {
    console.log("Login details:", req.body); 
    req.session.user = req.user;

    const { role, branch } = req.user;

    if (role === "manager") {
        if (branch === "Maganjo") {
            return res.redirect("/managerMaganjoDash");
        } else if (branch === "Matugga") {
            return res.redirect("/managerMatuggaDash");
        } else {
            return res.status(400).send("Unknown branch for manager");
        }
    } else if (role === "salesAgent") {
        if (branch === "Maganjo") {
            return res.redirect("/salesAgentMaganjoDash");
        } else if (branch === "Matugga") {
            return res.redirect("/salesAgentMatuggaDash");
        } else {
            return res.status(400).send("Unknown branch for sales agent");
        }
    } else if (role === "director") {
        return res.redirect("/directorDash");
    } else {
        return res.status(403).send("Unauthorized: Role not recognized");
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
