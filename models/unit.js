const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    chapters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    }],
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }
});

module.exports = mongoose.model('Unit', UnitSchema);
