const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const EmployerProfile = require('../models/EmployerProfile');
const JobPosting = require('../models/JobPosting');

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


// --- JOB POSTING ENDPOINTS ---

// @route   GET /api/jobs
// @desc    Get all active job postings
// @access  Public
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all jobs...');
        const jobs = await JobPosting.find({ is_active: true })
            .populate('employer_profile_id', 'company_name contact_name')
            .sort({ createdAt: -1 });

        // Ensure company_name is taken from the employer profile when available
        const normalized = jobs.map(doc => {
            const job = doc.toObject();
            const populatedName = job.employer_profile_id?.company_name;
            if (populatedName && populatedName !== job.company_name) {
                job.company_name = populatedName;
            }
            return job;
        });
        
        console.log('Found jobs:', jobs.length);
        res.json(normalized);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ 
            message: 'Server error fetching jobs.',
            error: error.message 
        });
    }
});

// @route   GET /api/jobs/:id
// @desc    Get a specific job posting
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await JobPosting.findById(req.params.id)
            .populate('employer_profile_id', 'company_name contact_name phone city');
        
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }
        
        res.json(job);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Server error fetching job.' });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Role: Employer)
router.post('/', protect, async (req, res) => {
    const { title, description, hourly_rate, estimated_hours, location_details, category_id } = req.body;
    let employerProfileId = req.user.profileId;

    console.log('Job creation attempt:', { 
        userId: req.user._id, 
        userRole: req.user.role, 
        profileId: employerProfileId,
        title: title 
    });

    if (!employerProfileId) {
        // Try to create a basic employer profile if it doesn't exist
        try {
            console.log('Creating missing employer profile for user:', req.user._id);
            const newProfile = await EmployerProfile.create({
                user_id: req.user._id,
                company_name: 'Your Company',
                contact_name: 'Contact Person',
                phone: '',
                city: 'Not specified',
            });
            employerProfileId = newProfile._id;
            req.user.profileId = newProfile._id;
            console.log('Created employer profile:', newProfile._id);
        } catch (profileError) {
            console.error('Error creating employer profile:', profileError);
            return res.status(400).json({ 
                message: 'Employer profile not found and could not be created automatically.',
                details: 'Please contact support or try logging out and back in.'
            });
        }
    }

    try {
        // Always denormalize from the employer's registered profile
        const employerProfile = await EmployerProfile.findById(employerProfileId);
        const companyName = employerProfile?.company_name || 'Company';

        console.log('Creating job with:', {
            employer_profile_id: employerProfileId,
            company_name: companyName,
            category_id,
            title,
            description: description ? 'Present' : 'Missing',
            hourly_rate,
            estimated_hours,
            location_details
        });
        
        const job = await JobPosting.create({
            employer_profile_id: employerProfileId,
            company_name: companyName,
            category_id,
            title,
            description,
            hourly_rate,
            estimated_hours,
            location_details
        });

        console.log('Job created successfully:', job._id);
        res.status(201).json(job);
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ 
            message: 'Server error creating job.',
            error: error.message 
        });
    }
});

module.exports = router;
