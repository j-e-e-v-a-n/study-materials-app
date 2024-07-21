const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const Unit = require('../models/unit');
const Chapter = require('../models/chapter');
const Note = require('../models/note');

// GET /subjects - List all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find().populate('units').lean();
        res.render('subjects/index', { subjects });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /subjects/:subjectId - List units for a subject
router.get('/subjects/:subjectId', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.subjectId).populate('units').lean();
        if (!subject) {
            return res.render('error/404');
        }
        res.render('subjects/units', { subject });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /units/:unitId - List chapters for a unit
router.get('/units/:unitId', async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.unitId).populate('chapters').lean();
        if (!unit) {
            console.error(`Unit not found for ID: ${req.params.unitId}`);
            return res.render('error/404');
        }
        res.render('unit/chapters', { unit });
    } catch (err) {
        console.error(`Error fetching unit: ${err.message}`);
        console.error(err.stack);
        res.render('error/500');
    }
});

// GET /chapters/:chapterId - List notes for a chapter
router.get('/chapters/:chapterId', async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.chapterId).lean();
        
        if (!chapter) {
            return res.render('error/404');
        }
        console.log(chapter)
        res.render('chapters/notes', { chapter });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


module.exports = router;
