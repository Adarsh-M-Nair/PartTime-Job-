const mongoose = require('mongoose');

const EmployerProfileSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Enforces 1:1 relationship with User
    },
    company_name: { type: String, required: true },
    contact_name: { type: String, required: true },
    phone: { type: String },
    city: { type: String, required: true },
}, {
    timestamps: true
});

module.exports = mongoose.model('EmployerProfile', EmployerProfileSchema);
