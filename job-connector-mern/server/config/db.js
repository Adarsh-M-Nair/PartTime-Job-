const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // NOTE: useNewUrlParser and useUnifiedTopology are no longer necessary in modern Mongoose versions (6.0+).
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-connector';
        console.log('Attempting to connect to MongoDB with URI:', mongoURI);
        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
