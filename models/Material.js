

const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    files: [{
        type: String,
        required: true // Array of filenames
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Material', MaterialSchema);