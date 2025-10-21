const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes by checking for a valid JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (excluding the password field)
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            
            // --- Attach Profile ID for quick lookups (optimization) ---
            // This is crucial for verifying ownership in job posting/application logic
            let profile;
            if (req.user.role === 'Student') {
                profile = await require('../models/StudentProfile').findOne({ user_id: req.user._id });
            } else if (req.user.role === 'Employer') {
                profile = await require('../models/EmployerProfile').findOne({ user_id: req.user._id });
            }
            req.user.profileId = profile ? profile._id : null;
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Check if the user has the required role
const checkRole = (roles) => (req, res, next) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!req.user || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: Insufficient role permissions.' });
    }
    next();
};

module.exports = { protect, checkRole };
