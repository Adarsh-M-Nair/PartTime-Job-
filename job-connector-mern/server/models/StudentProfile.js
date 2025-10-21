const mongoose = require('mongoose');

const StudentProfileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Enforces 1:1 relationship with User
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    university: { type: String },
    major: { type: String },
    year_of_study: { type: Number, min: 1, max: 5 },
}, {
    timestamps: true
});

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
