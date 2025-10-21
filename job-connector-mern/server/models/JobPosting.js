const mongoose = require('mongoose');

const JobPostingSchema = mongoose.Schema({
    employer_profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmployerProfile',
        required: true
    },
    company_name: {
        type: String, // Denormalized for display speed
        required: true
    },
    category_id: { // Simple category ID
        type: Number, 
        required: true
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    hourly_rate: { type: Number, required: true },
    estimated_hours: { type: Number },
    location_details: { type: String, required: true },
    is_active: { type: Boolean, default: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('JobPosting', JobPostingSchema);
