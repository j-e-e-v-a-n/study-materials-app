const mongoose = require('mongoose');

// Define the User schema with email and super admin field
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
 
// Export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
