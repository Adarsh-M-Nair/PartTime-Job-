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

    // Validate name field for registration
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Name is required for registration' });
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
            let profileName = null;
            
            // Create appropriate profile based on user type
            if (role === 'Student') {
                const StudentProfile = require('../models/StudentProfile');
                // Split name into first and last name
                const nameParts = (name || 'Student').trim().split(' ');
                const firstName = nameParts[0] || 'Student';
                const lastName = nameParts.slice(1).join(' ').trim() || '';
                
                const studentProfile = await StudentProfile.create({
                    user_id: user._id,
                    first_name: firstName,
                    last_name: lastName || firstName, // Use first name if no last name (required field)
                    university: '',
                    major: '',
                    year_of_study: 1,
                });
                
                // Get name from the created profile - only show last name if it exists and is different
                if (studentProfile) {
                    if (studentProfile.last_name && 
                        studentProfile.last_name.trim() !== '' && 
                        studentProfile.last_name !== studentProfile.first_name &&
                        studentProfile.last_name !== 'User') {
                        profileName = `${studentProfile.first_name} ${studentProfile.last_name}`.trim();
                    } else {
                        profileName = studentProfile.first_name;
                    }
                }
            } else if (role === 'Employer') {
                const EmployerProfile = require('../models/EmployerProfile');
                const employerProfile = await EmployerProfile.create({
                    user_id: user._id,
                    company_name: name || 'Company',
                    contact_name: name || 'Contact',
                    phone: '',
                    city: 'Not specified',
                });
                
                // Get name from the created profile
                if (employerProfile) {
                    profileName = employerProfile.contact_name || employerProfile.company_name;
                }
            }
            
            res.status(201).json({
                _id: user._id,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                name: profileName || (role === 'Student' ? 'Student User' : 'Employer'),
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        // Provide more specific error messages
        if (error.code === 11000) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message || 'Validation error' });
        }
        res.status(500).json({ 
            message: 'Server error during registration',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
            // Fetch profile to get name
            let name = null;
            if (user.role === 'Student') {
                const StudentProfile = require('../models/StudentProfile');
                const profile = await StudentProfile.findOne({ user_id: user._id });
                if (profile) {
                    // Only include last name if it exists and is different from first name
                    if (profile.last_name && profile.last_name !== profile.first_name && profile.last_name !== 'User') {
                        name = `${profile.first_name} ${profile.last_name}`.trim();
                    } else {
                        name = profile.first_name;
                    }
                }
            } else if (user.role === 'Employer') {
                const EmployerProfile = require('../models/EmployerProfile');
                const profile = await EmployerProfile.findOne({ user_id: user._id });
                if (profile) {
                    name = profile.contact_name || profile.company_name;
                }
            }
            
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                isProfileComplete: user.isProfileComplete,
                name: name || 'User',
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
router.get('/me', protect, async (req, res) => {
    try {
        // Fetch profile to get name
        let name = null;
        if (req.user.role === 'Student') {
            const StudentProfile = require('../models/StudentProfile');
            const profile = await StudentProfile.findOne({ user_id: req.user._id });
            if (profile) {
                // Only include last name if it exists and is different from first name
                if (profile.last_name && profile.last_name !== profile.first_name && profile.last_name !== 'User') {
                    name = `${profile.first_name} ${profile.last_name}`.trim();
                } else {
                    name = profile.first_name;
                }
            }
        } else if (req.user.role === 'Employer') {
            const EmployerProfile = require('../models/EmployerProfile');
            const profile = await EmployerProfile.findOne({ user_id: req.user._id });
            if (profile) {
                name = profile.contact_name || profile.company_name;
            }
        }
        
        res.json({
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
            isProfileComplete: req.user.isProfileComplete,
            name: name || 'User',
            createdAt: req.user.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching user data' });
    }
});


module.exports = router;
