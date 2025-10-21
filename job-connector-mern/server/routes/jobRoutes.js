const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const EmployerProfile = require('../models/EmployerProfile');

// @route   POST /api/profiles/student
// @desc    Create Student Profile and update user role
// @access  Private 
router.post('/student', protect, async (req, res) => {
    const userId = req.user.id;
    const { first_name, last_name, university, major, year_of_study } = req.body;

    try {
        // 1. Create Student Profile
        const profile = await StudentProfile.create({
            user_id: userId,
            first_name,
            last_name,
            university,
            major,
            year_of_study
        });

        // 2. Update User role and profile status
        const user = await User.findByIdAndUpdate(userId, 
            { role: 'Student', isProfileComplete: true }, 
            { new: true }
        );

        res.status(201).json({ 
            profile, 
            message: 'Student profile created and role updated.', 
            newRole: user.role 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Profile already exists for this user.' });
        }
        res.status(500).json({ message: 'Server error creating student profile.' });
    }
});

// @route   POST /api/profiles/employer
// @desc    Create Employer Profile and update user role
// @access  Private
router.post('/employer', protect, async (req, res) => {
    const userId = req.user.id;
    const { company_name, contact_name, phone, city } = req.body;

    try {
        // 1. Create Employer Profile
        const profile = await EmployerProfile.create({
            user_id: userId,
            company_name,
            contact_name,
            phone,
            city
        });

        // 2. Update User role and profile status
        const user = await User.findByIdAndUpdate(userId, 
            { role: 'Employer', isProfileComplete: true }, 
            { new: true }
        );

        res.status(201).json({ 
            profile, 
            message: 'Employer profile created and role updated.', 
            newRole: user.role 
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Profile already exists for this user.' });
        }
        res.status(500).json({ message: 'Server error creating employer profile.' });
    }
});

// @route   GET /api/profiles/me
// @desc    Get the currently logged-in user's profile data
// @access  Private
router.get('/me', protect, async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    let profile = null;

    try {
        if (role === 'Student') {
            profile = await StudentProfile.findOne({ user_id: userId });
        } else if (role === 'Employer') {
            profile = await EmployerProfile.findOne({ user_id: userId });
        }

        if (!profile) {
            // This case handles NewUser or user with incomplete profile
            return res.status(404).json({ message: `Profile not found for role ${role}` });
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
});


module.exports = router;
