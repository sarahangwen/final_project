const express = require("express");
const router = express.Router();
const passport = require("passport");

// Import models
const SignUp = require("../models/Signup");
const Signup = require("../models/Signup");
//const Signup = require("../models/Signup");

// Render signup form
router.get("/signingup", (req, res) => {
    res.render("signUp"); // Render signUp view
});

// Handle signup
router.post('/signingup', async (req, res) => {
    try {
        console.log("REQ BODY:", req.body); // Debug: check password format

        const user = new SignUp(req.body);
        const existingUser = await SignUp.findOne({ email: req.body.email });

        if (existingUser) {
            return res.status(400).send("Not registered, email already exists");
        }

        // Ensure password is passed as a string
        SignUp.register(user, String(req.body.password), (error) => {
            if (error) {
                throw error;
            }
            console.log("New user registered:", user);
            res.redirect("/login");
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(400).render("signUp");
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
    if (req.user.role === "manager") {
        res.redirect("/managerDash");
    } else if (req.user.role === "salesAgent") {
        res.redirect("/salesAgentDash");
    } else if (req.user.role === "director") {
        res.redirect("/directorDash");
    } else {
        res.send("You do not have any role in the system");
    }
});

// Logout
router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                return res.status(500).send("Error logging out: " + error.message);
            }
            res.redirect("/");
        });
    }
});


module.exports = router;
