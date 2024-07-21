const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const Chapter = require('../models/chapter');
const upload = require('../middleware/multer');
const fs = require('fs');
const path = require('path');

// GET /admin/addNotes/:id
router.get('/addNotes/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('unit').lean();
        if (chapter) {
            res.render('admin/addNotes', { chapter });
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error('Error fetching chapter:', err);
        res.render('error/500');
    }
});

// POST /admin/addNotes/:id
router.post('/addNotes/:id', ensureAuthenticated, ensureAdmin, upload.array('notes', 10), async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            const notesPaths = req.files.map(file => `/uploads/${file.filename}`);
            chapter.notesPaths = chapter.notesPaths.concat(notesPaths);
            await chapter.save();
            req.flash('success_msg', 'Notes added successfully.');
            res.redirect('/admin/manageChapters');
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error('Error adding notes:', err);
        res.render('error/500');
    }
});

module.exports = router;
