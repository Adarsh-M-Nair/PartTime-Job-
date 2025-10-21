const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
    job_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'JobPosting', 
        required: true 
    },
    student_profile_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'StudentProfile', 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Reviewed', 'Interview', 'Hired', 'Rejected'], 
        default: 'Pending' 
    },
    cover_letter: { 
        type: String 
    },
}, {
    timestamps: true
});

// Enforce unique application per job/student pair
ApplicationSchema.index({ job_id: 1, student_profile_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
