const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    unit: {
        type: Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    notesPaths: [{
        type: String,
        ref: 'Note'
    }] 
});

module.exports = mongoose.model('Chapter', ChapterSchema);