const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import models
const SignUp = require('../models/Signup');

const resolveDashboardRoute = (role) => {
    const normalizedRole = String(role || '').trim().toLowerCase();

    const exactRoleMap = {
        managermaganjo: '/managerMaganjoDash',
        managermatugga: '/managerMatuggaDash',
        salesagentmaganjo: '/salesAgentMaganjoDash',
        salesagentmatugga: '/salesAgentMatuggaDash',
        director: '/directorDash'
    };

    const compactRole = normalizedRole.replace(/[^a-z]/g, '');
    if (exactRoleMap[compactRole]) {
        return exactRoleMap[compactRole];
    }

    if (compactRole.includes('manager') && compactRole.includes('maganjo')) {
        return '/managerMaganjoDash';
    }
    if (compactRole.includes('manager') && compactRole.includes('matugga')) {
        return '/managerMatuggaDash';
    }
    if (compactRole.includes('salesagent') && compactRole.includes('maganjo')) {
        return '/salesAgentMaganjoDash';
    }
    if (compactRole.includes('salesagent') && compactRole.includes('matugga')) {
        return '/salesAgentMatuggaDash';
    }
    if (compactRole.includes('director')) {
        return '/directorDash';
    }

    return null;
};

const ALLOWED_ROLES = [
    'managerMaganjo',
    'managerMatugga',
    'salesAgentMaganjo',
    'salesAgentMatugga',
    'director'
];

const normalizePhoneNumber = (value) => String(value || '').replace(/\s+/g, '').trim();

const signupErrorMessage = (error) => {
    if (!error) {
        return 'Failed to register. Please try again.';
    }

    if (error.name === 'UserExistsError') {
        return 'Email already registered. Please use a different one.';
    }

    if (error.code === 11000) {
        if (error.keyPattern?.email) {
            return 'Email already registered. Please use a different one.';
        }
        if (error.keyPattern?.phoneNumber) {
            return 'Phone number already registered. Please use a different one.';
        }
        return 'A duplicate account value was detected. Please verify your details.';
    }

    if (error.name === 'ValidationError') {
        const firstValidationError = Object.values(error.errors || {})[0];
        if (firstValidationError?.message) {
            return firstValidationError.message;
        }
    }

    return 'Failed to register. Please try again.';
};

// Render signup form
router.get('/signingup', (req, res) => {
    res.render('signUp', { formData: {}, error: null });
});

// Handle signup logic
router.post('/signingup', async (req, res) => {
    try {
        console.log('Signup Request Body:', req.body);

        const email = String(req.body.email || '').trim().toLowerCase();
        const phoneNumber = normalizePhoneNumber(req.body.phoneNumber);
        const role = String(req.body.role || '').trim();
        const password = String(req.body.password || '');
        const confirmPassword = String(req.body.confirmPassword || '');

        const formData = { email, phoneNumber, role };

        if (!email || !phoneNumber || !role || !password || !confirmPassword) {
            return res.status(400).render('signUp', {
                error: 'Please complete all required fields.',
                formData
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).render('signUp', {
                error: 'Please enter a valid email address.',
                formData
            });
        }

        if (!/^(?:\+256|0)(7\d{8})$/.test(phoneNumber)) {
            return res.status(400).render('signUp', {
                error: 'Please enter a valid Ugandan phone number (07XXXXXXXX or +2567XXXXXXXX).',
                formData
            });
        }

        if (!ALLOWED_ROLES.includes(role)) {
            return res.status(400).render('signUp', {
                error: 'Please select a valid role.',
                formData
            });
        }

        if (password.length < 8) {
            return res.status(400).render('signUp', {
                error: 'Password must be at least 8 characters long.',
                formData
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).render('signUp', {
                error: 'Password and Confirm Password do not match.',
                formData
            });
        }

        const existingUser = await SignUp.findOne({ email });

        if (existingUser) {
            return res.status(400).render('signUp', {
                error: 'Email already registered. Please use a different one.',
                formData
            });
        }

        const existingPhone = await SignUp.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(400).render('signUp', {
                error: 'Phone number already registered. Please use a different one.',
                formData
            });
        }

        const user = new SignUp({ email, phoneNumber, role });
        await SignUp.register(user, String(password));  // Ensures password is string

        console.log('New user registered:', user);
        res.redirect('/login');

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(400).render('signUp', {
            error: signupErrorMessage(error),
            formData: {
                email: String(req.body.email || '').trim().toLowerCase(),
                phoneNumber: normalizePhoneNumber(req.body.phoneNumber),
                role: String(req.body.role || '').trim()
            }
        });
    }
});

// Render login form
router.get('/login', (req, res) => {
    const message = req.session.messages || [];
    req.session.messages = [];
    res.render('login', { message });
});

// Handle login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: 'Invalid email or password.'
}), (req, res) => {
    console.log('Login details:', req.body);
    req.session.user = req.user;

    const dashboardRoute = resolveDashboardRoute(req.user?.role);
    if (dashboardRoute) {
        return res.redirect(dashboardRoute);
    }

    console.warn('Login succeeded but role has no dashboard mapping:', req.user?.role);
    return res.status(403).send('Your account role is not mapped to a dashboard. Please contact admin.');
});

    


// Logout route
router.get('/logout', (req, res) => {  
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Logout error: ' + err.message);
        }
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});

module.exports = router;
