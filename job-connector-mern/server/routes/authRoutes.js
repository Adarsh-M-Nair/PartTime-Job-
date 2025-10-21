const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password, userType, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Determine role based on userType
        const role = userType === 'employer' ? 'Employer' : 'Student';

        user = await User.create({
            email,
            password,
            role: role,
            isProfileComplete: false,
        });

        if (user) {
            // Create appropriate profile based on user type
            if (role === 'Student') {
                const StudentProfile = require('../models/StudentProfile');
                // Split name into first and last name
                const nameParts = (name || 'Student').split(' ');
                const firstName = nameParts[0] || 'Student';
                const lastName = nameParts.slice(1).join(' ') || 'User';
                
                await StudentProfile.create({
                    user_id: user._id,
                    first_name: firstName,
                    last_name: lastName,
                    university: '',
                    major: '',
                    year_of_study: 1,
                });
            } else if (role === 'Employer') {
                const EmployerProfile = require('../models/EmployerProfile');
                await EmployerProfile.create({
                    user_id: user._id,
                    company_name: name || 'Company',
                    contact_name: name || 'Contact',
                    phone: '',
                    city: 'Not specified',
                });
            }

            res.status(201).json({
                _id: user._id,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get user data using token
// @access  Private
router.get('/me', protect, (req, res) => {
    res.json({
        id: req.user._id,
        email: req.user.email,
        role: req.user.role,
        isProfileComplete: req.user.isProfileComplete,
        createdAt: req.user.createdAt,
    });
});


module.exports = router;
