const express = require('express');
const router = express.Router();
const { protect, checkRole } = require('../middleware/authMiddleware');
const JobPosting = require('../models/JobPosting');
const Application = require('../models/Application');
const EmployerProfile = require('../models/EmployerProfile');

// --- JOB POSTING ENDPOINTS ---

// @route   GET /api/jobs
// @desc    Get all active job postings (Student View)
// @access  Public (Optional checkRole(['Student', 'Employer']) could be added)
router.get('/', async (req, res) => {
    try {
        const jobs = await JobPosting.find({ is_active: true }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching job postings.' });
    }
});

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (Role: Employer)
router.post('/', protect, checkRole('Employer'), async (req, res) => {
    const { category_id, title, description, hourly_rate, estimated_hours, location_details } = req.body;
    const employerProfileId = req.user.profileId; 

    if (!employerProfileId) {
        return res.status(400).json({ message: 'Employer profile ID missing for authenticated user.' });
    }

    try {
        // Fetch company name from profile for denormalization
        const employerProfile = await EmployerProfile.findById(employerProfileId);

        const newJob = await JobPosting.create({
            employer_profile_id: employerProfileId,
            company_name: employerProfile.company_name, 
            category_id,
            title,
            description,
            hourly_rate,
            estimated_hours,
            location_details
        });
        res.status(201).json(newJob);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error posting job.' });
    }
});

// @route   GET /api/jobs/employer
// @desc    Get jobs posted by the logged-in Employer
// @access  Private (Role: Employer)
router.get('/employer', protect, checkRole('Employer'), async (req, res) => {
    const employerProfileId = req.user.profileId; 
    if (!employerProfileId) {
        return res.status(400).json({ message: 'Employer profile not found.' });
    }
    
    try {
        const jobs = await JobPosting.find({ employer_profile_id: employerProfileId }).sort({ createdAt: -1 });

        // Attach application counts (use $or to match both ObjectId and string, but avoid duplicates)
        const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
            try {
                // Count applications matching either ObjectId or string format, but use distinct to avoid duplicates
                const count = await Application.countDocuments({
                    $or: [
                        { job_id: job._id },
                        { job_id: job._id.toString() }
                    ]
                });
                const obj = job.toObject();
                obj.applicationCount = count;
                return obj;
            } catch (error) {
                console.error('Error counting applications for job:', job._id, error);
                const obj = job.toObject();
                obj.applicationCount = 0;
                return obj;
            }
        }));

        res.json(jobsWithCounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching employer jobs.' });
    }
});


// --- APPLICATION ENDPOINTS ---

// @route   POST /api/profiles/apply
// @desc    Submit a job application
// @access  Private (Role: Student)
router.post('/apply', protect, checkRole('Student'), async (req, res) => {
    const { job_id, cover_letter } = req.body;
    const studentProfileId = req.user.profileId;

    console.log('Application attempt:', { 
        userId: req.user._id, 
        userRole: req.user.role, 
        profileId: studentProfileId,
        jobId: job_id 
    });

    if (!studentProfileId) {
        // Try to create a basic student profile if it doesn't exist
        try {
            console.log('Creating missing student profile for user:', req.user._id);
            const StudentProfile = require('../models/StudentProfile');
            const newProfile = await StudentProfile.create({
                user_id: req.user._id,
                first_name: 'Student',
                last_name: 'User',
                university: '',
                major: '',
                year_of_study: 1,
            });
            req.user.profileId = newProfile._id;
            console.log('Created student profile:', newProfile._id);
        } catch (profileError) {
            console.error('Error creating student profile:', profileError);
            return res.status(400).json({ 
                message: 'Student profile not found and could not be created automatically.',
                details: 'Please contact support or try logging out and back in.'
            });
        }
    }

    try {
        console.log('Creating application with:', {
            job_id,
            student_profile_id: req.user.profileId,
            cover_letter: cover_letter ? 'Present' : 'Missing'
        });
        
        const application = await Application.create({
            job_id,
            student_profile_id: req.user.profileId,
            cover_letter
        });
        
        console.log('Application created successfully:', application._id);
        res.status(201).json(application);
    } catch (error) {
        console.error('Error creating application:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already applied to this job.' });
        }
        res.status(500).json({ 
            message: 'Server error submitting application.',
            error: error.message 
        });
    }
});

// @route   GET /api/profiles/applications/me
// @desc    Get applications submitted by the logged-in Student
// @access  Private (Role: Student)
router.get('/applications/me', protect, checkRole('Student'), async (req, res) => {
    const studentProfileId = req.user.profileId;

    if (!studentProfileId) {
        // Try to create a basic student profile if it doesn't exist
        try {
            console.log('Creating missing student profile for user:', req.user._id);
            const StudentProfile = require('../models/StudentProfile');
            const newProfile = await StudentProfile.create({
                user_id: req.user._id,
                first_name: 'Student',
                last_name: 'User',
                university: '',
                major: '',
                year_of_study: 1,
            });
            req.user.profileId = newProfile._id;
            console.log('Created student profile:', newProfile._id);
        } catch (profileError) {
            console.error('Error creating student profile:', profileError);
            return res.status(400).json({ 
                message: 'Student profile not found and could not be created automatically.',
                details: 'Please contact support or try logging out and back in.'
            });
        }
    }

    try {
        console.log('Fetching applications for profile:', req.user.profileId);
        
        // Populate job and its employer profile to ensure correct company_name
        let applications = await Application.find({ student_profile_id: req.user.profileId })
            .populate({
                path: 'job_id',
                select: 'title company_name location_details employer_profile_id',
                populate: { path: 'employer_profile_id', select: 'company_name' }
            });

        // If any application still lacks populated job data (legacy string IDs), backfill on the fly
        const needsBackfill = applications.some(a => !a.job_id || !a.job_id.title);
        if (needsBackfill) {
            const JobPosting = require('../models/JobPosting');
            const withJobs = await Promise.all(applications.map(async (a) => {
                if (a.job_id && a.job_id.title) return a; // already populated
                try {
                    const job = await JobPosting.findById(a.job_id);
                    if (job) {
                        const obj = a.toObject();
                        obj.job_id = { _id: job._id, title: job.title, company_name: job.company_name, location_details: job.location_details };
                        return obj;
                    }
                } catch (_) {}
                return a;
            }));
            applications = withJobs;
        }

        // Normalize company_name from employer profile when available
        applications = applications.map(a => {
            const obj = typeof a.toObject === 'function' ? a.toObject() : a;
            const job = obj.job_id;
            if (job && job.employer_profile_id && job.employer_profile_id.company_name) {
                job.company_name = job.employer_profile_id.company_name;
            }
            return obj;
        });
        
        console.log('Found applications:', applications.length);
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ 
            message: 'Server error fetching applications.',
            error: error.message 
        });
    }
});

// @route   GET /api/jobs/applications/:jobId
// @desc    Get applications for a specific job (Employer View)
// @access  Private (Role: Employer, and must own the job)
router.get('/applications/:jobId', protect, checkRole('Employer'), async (req, res) => {
    const { jobId } = req.params;
    const employerProfileId = req.user.profileId;

    try {
        // 1. Verify Employer owns the job (Crucial Security Check)
        const job = await JobPosting.findById(jobId);
        if (!job || job.employer_profile_id.toString() !== employerProfileId.toString()) { 
             return res.status(403).json({ message: 'Forbidden: You do not own this job posting.' });
        }

        // 2. Fetch applications for the job and populate student details
        let applications = await Application.find({
                $or: [
                    { job_id: jobId },                 // legacy string match
                    { job_id: job._id }                // ObjectId match
                ]
            })
            .populate({
                path: 'student_profile_id',
                select: 'first_name last_name university major year_of_study'
            }); 
        
        // Ensure student names are never empty - provide defaults if missing
        const StudentProfile = require('../models/StudentProfile');
        applications = await Promise.all(applications.map(async (app) => {
            const obj = app.toObject ? app.toObject() : app;
            
            // Check if student_profile_id was populated successfully
            let studentProfile = obj.student_profile_id;
            
            // If populate failed (returns null or ObjectId string), fetch manually
            if (!studentProfile || typeof studentProfile === 'string') {
                // Get the profile ID from the original document
                const profileId = typeof studentProfile === 'string' 
                    ? studentProfile 
                    : (app.student_profile_id?.toString() || app.student_profile_id);
                
                if (profileId) {
                    try {
                        const fetchedProfile = await StudentProfile.findById(profileId).select('first_name last_name university major year_of_study').lean();
                        if (fetchedProfile) {
                            studentProfile = fetchedProfile;
                        }
                    } catch (err) {
                        console.error('Error fetching student profile:', err);
                        studentProfile = null;
                    }
                }
            }
            
            // Extract and normalize names - only apply defaults if truly missing
            let finalFirstName = studentProfile?.first_name;
            let finalLastName = studentProfile?.last_name;
            
            // Convert to string and trim, but preserve the original value if it exists
            if (finalFirstName !== null && finalFirstName !== undefined) {
                finalFirstName = finalFirstName.toString().trim();
            }
            if (finalLastName !== null && finalLastName !== undefined) {
                finalLastName = finalLastName.toString().trim();
            }
            
            // Only apply defaults if names are truly empty or missing
            if (!finalFirstName || finalFirstName === '') {
                finalFirstName = 'Student';
            }
            // Don't set last_name to 'User' - use empty string or first name if needed
            if (!finalLastName || finalLastName === '' || finalLastName === 'User') {
                finalLastName = '';
            }
            
            // Build the final student profile object
            studentProfile = {
                first_name: finalFirstName,
                last_name: finalLastName,
                university: studentProfile?.university || null,
                major: studentProfile?.major || null,
                year_of_study: studentProfile?.year_of_study || null
            };
            
            obj.student_profile_id = studentProfile;
            return obj;
        }));
        
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching applications.' });
    }
});

// @route   PUT /api/jobs/applications/:id/status
// @desc    Update application status
// @access  Private (Role: Employer, and must own the job's posting)
router.put('/applications/:id/status', protect, checkRole('Employer'), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const employerProfileId = req.user.profileId;

    try {
        const application = await Application.findById(id).populate('job_id');
        
        if (!application) {
            return res.status(404).json({ message: 'Application not found.' });
        }

        // 1. Verify Employer owns the job (Security Check)
        if (application.job_id.employer_profile_id.toString() !== employerProfileId.toString()) { 
             return res.status(403).json({ message: 'Forbidden: You do not have permission to update this application.' });
        }

        // 2. Update status
        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error updating application status.' });
    }
});

module.exports = router;
