const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    units: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit'
    }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
