const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const Material = require('../models/Material');
const User = require('../models/User');
const Subject = require('../models/subject');
const Unit = require('../models/unit');
const Chapter = require('../models/chapter');
const upload = require('../middleware/multer');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash'); 
// GET /admin/manageMaterials
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    if(req.user.issuperAdmin){
        try {
            const materials = await User.find().lean();
            res.render('admin/superadmin', { materials });
        } catch (err) {
            console.error(err);
            res.render('error/500');
        } 
    }else{
        try {
            const materials = await User.find().lean();
            res.render('admin/admin', { materials });
        } catch (err) {
            console.error(err);
            res.render('error/500');
        }
    }
    
});
router.get('/deleteUser/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Check if trying to delete the super admin (to avoid deletion of superuser)

            await User.findByIdAndDelete(req.params.id);
            console.log('success_msg', 'User deleted successfully.');
            res.redirect('/');
        } else {
            req.flash('error_msg', 'User not found.');
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});
// GET /admin/manageSubjects
router.get('/manageSubjects', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const subjects = await Subject.find().lean();
        res.render('admin/manageSubjects', { subjects });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/addSubject
router.get('/addSubject', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/addSubject');
});

// POST /admin/addSubject
router.post('/addSubject', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { title } = req.body;
        const newSubject = new Subject({ title });
        await newSubject.save();
        res.redirect('/admin/manageSubjects');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/editSubject/:id
router.get('/editSubject/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id).lean();
        if (subject) {
            res.render('admin/editSubject', { subject });
        } else {
            req.flash('error_msg', 'Subject not found.');
            res.redirect('/admin/manageSubjects');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// POST /admin/editSubject/:id
router.post('/editSubject/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { title } = req.body;
        await Subject.findByIdAndUpdate(req.params.id, { title });
        req.flash('success_msg', 'Subject updated successfully.');
        res.redirect('/admin/manageSubjects');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/deleteSubject/:id
router.get('/deleteSubject/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Subject deleted successfully.');
        res.redirect('/admin/manageSubjects');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

router.get('/manageMaterials', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const materials = await Material.find().lean();
        res.render('admin/manageMaterials', { materials });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/addMaterial
router.post('/addMaterial', upload.array('pdf', 10), async (req, res) => {
    try {
        const { title, description } = req.body;
        const files = req.files.map(file => file.filename); // Extract filenames

        // Create a new material with uploaded file names
        const newMaterial = new Material({
            title,
            description,
            files
        });

        await newMaterial.save();
        res.redirect('/materials'); // Redirect or respond as needed
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

router.post('/chapters/add', async (req, res) => {
    try {
        const { title, unitId } = req.body;
        const newChapter = new Chapter({ title });
        await newChapter.save();

        // Add the chapter to the unit
        const unit = await Unit.findById(unitId);
        unit.chapters.push(newChapter._id);
        await unit.save();

        res.redirect(`/units/${unitId}`);
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


// POST /admin/addMaterial
router.post('/addMaterial', upload.array('pdf'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const files = req.files.map(file => file.filename); // Extract filenames

        // Create a new material with uploaded file names
        const newMaterial = new Material({
            title,
            description,
            files
        });

        await newMaterial.save();
        res.redirect('/materials'); // Redirect or respond as needed
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/deleteMaterial/:id
router.get('/deleteMaterial/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (material) {
            const filePath = path.join(__dirname, '../', material.pdfPath);
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.error(err);
                }
                await Material.findByIdAndDelete(req.params.id); // Updated line
                res.redirect('/admin/manageMaterials');
            });
        } else {
            res.redirect('/admin/manageMaterials');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/deleteUser/:id

router.get('/editMaterial/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const material = await Material.findById(req.params.id).lean();
        if (material) {
            res.render('admin/editMaterial', { material });
        } else {
            req.flash('error_msg', 'Material not found.');
            res.redirect('/admin/manageMaterials');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});
// POST /admin/editMaterial/:id
router.post('/editMaterial/:id', ensureAuthenticated, ensureAdmin, upload.single('pdf'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const material = await Material.findById(req.params.id);
        if (material) {
            let pdfPath = material.pdfPath;

            // If a new file is uploaded, update the pdfPath and delete the old file
            if (req.file) {
                const oldFilePath = path.join(__dirname, '../', material.pdfPath);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.error(err);
                });
                pdfPath = `/uploads/${req.file.filename}`;
            }

            await Material.findByIdAndUpdate(req.params.id, { title, description, pdfPath });
            console.log('success_msg', 'Material updated successfully.');
            res.redirect('/admin/manageMaterials');
        } else {
            console.log('error_msg', 'Material not found.');
            res.redirect('/admin/manageMaterials');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});
router.get('/manageUnits', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        // Fetch all units and subjects
        const units = await Unit.find().lean();
        const subjects = await Subject.find().lean();

        // Create a lookup table for subjects by their IDs
        const subjectMap = subjects.reduce((map, subject) => {
            map[subject._id.toString()] = subject.title;
            return map;
        }, {});

        // Add subject titles to each unit
        const unitsWithSubjects = units.map(unit => {
            // Extract the subject ID from the unit's subject field
            const subjectId = unit.subject.toString(); // Convert ObjectId to string
            const subjectTitle = subjectMap[subjectId] || 'Unknown Subject';

            return { ...unit, subjectTitle };
        });

        // Render the view with units including subject titles
        res.render('admin/manageUnits', { units: unitsWithSubjects });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

router.post('/units/add', async (req, res) => {
    try {
        const { title, subjectId } = req.body;
        const newUnit = new Unit({
            title,
            subject: subjectId
        });
        await newUnit.save();

        // Add the unit to the subject
        const subject = await Subject.findById(subjectId);
        subject.units.push(newUnit._id);
        await subject.save();

        res.redirect(`/subjects/${subjectId}`);
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/addUnit
router.get('/addUnit', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const subjects = await Subject.find().lean();
        res.render('admin/addUnits', { subjects });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// POST /admin/addUnit
router.post('/addUnit', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { title, subjectId } = req.body;
        const newUnit = new Unit({
            title,
            subject: subjectId
        });
        await newUnit.save();

        // Add the unit to the subject
        const subject = await Subject.findById(subjectId);
        subject.units.push(newUnit._id);
        await subject.save();

        res.redirect('/admin/manageUnits');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/editUnit/:id
router.get('/editUnit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        // Find the unit by ID
        const unit = await Unit.findById(req.params.id).lean();
        // Fetch all subjects for the dropdown
        const subjects = await Subject.find().lean();
        
        // Check if the unit exists
        if (unit) {
            console.log(subjects)
            // Render the editUnit template with unit and subjects data
            res.render('admin/editUnits', { unit, subjects });
        } else {
            // Redirect with an error message if the unit is not found
            req.flash('error_msg', 'Unit not found.');
            res.redirect('/admin/manageUnits');
        }
    } catch (err) {
        // Log the error and render a 500 error page
        console.error(err);
        res.render('error/500');
    }
});
// In routes/admin.js or similar file
router.post('/updateUnit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { title, subjectId } = req.body;
        const unit = await Unit.findById(req.params.id);

        if (unit) {
            unit.title = title;
            unit.subject = subjectId;
            await unit.save();
            req.flash('success_msg', 'Unit updated successfully.');
            res.redirect('/admin/manageUnits');
        } else {
            req.flash('error_msg', 'Unit not found.');
            res.redirect('/admin/manageUnits');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// POST /admin/editUnit/:id
router.post('/editUnit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const { title, subjectId } = req.body;
        await Unit.findByIdAndUpdate(req.params.id, { title, subject: subjectId });
        req.flash('success_msg', 'Unit updated successfully.');
        res.redirect('/admin/manageUnits');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/deleteUnit/:id
router.get('/deleteUnit/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        await Unit.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Unit deleted successfully.');
        res.redirect('/admin/manageUnits');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/manageChapters
router.get('/manageChapters', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const chapters = await Chapter.find().populate({
            path: 'unit',
            populate: {
                path: 'subject',
                model: 'Subject'
            }
        }).lean();
        res.render('admin/manageChapters', { chapters });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/addChapter
router.get('/addChapter', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        // Fetch all units and subjects
        const units = await Unit.find().lean();
        const subjects = await Subject.find().lean();

        // Create a lookup table for subjects by their IDs
        const subjectMap = subjects.reduce((map, subject) => {
            map[subject._id.toString()] = subject.title;
            return map;
        }, {});

        // Add subject titles to each unit
        const unitsWithSubjects = units.map(unit => {
            // Extract the subject ID from each unit's subject field
            const subjectId = unit.subject.toString(); // Convert ObjectId to string
            const subjectTitle = subjectMap[subjectId] || 'Unknown Subject';

            return { ...unit, subjectTitle };
        });

        // Render the view with units including subject titles
        res.render('admin/addChapter', { units: unitsWithSubjects });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


// POST /admin/addChapter
router.post('/addChapter', ensureAuthenticated, ensureAdmin, async (req, res) => {
    console.lo
    try {
        const { title, unitId } = req.body;
        console.log('Request Body:', req.body); // Log the request body

        // Check if title and unitId are present
        if (!title || !unitId) {
            throw new Error('Title and Unit ID are required');
        }

        // Create and save the new Chapter
        const newChapter = new Chapter({ title, unit: unitId });
        await newChapter.save();

        // Update the Unit with the new Chapter 
        const unit = await Unit.findById(unitId);
        unit.chapters.push(newChapter._id);
        await unit.save();

        res.redirect('/admin/manageChapters');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

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
        console.error(err);
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
        console.error(err);
        res.render('error/500');
    }
});

// GET /admin/editChapter/:id
router.get('/editChapter/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id).populate('unit').lean();
        const units = await Unit.find().lean();

        if (chapter) {
            
            res.render('admin/editChapter', { chapter, units });
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'An error occurred while fetching the chapter details.');
        res.redirect('/admin/manageChapters');
    }
});

// POST /admin/editChapter/:id
router.post('/editChapter/:id', ensureAuthenticated, ensureAdmin, upload.array('newNotes', 10), async (req, res) => {
    try {
        const { title, unitId, removeNotes } = req.body;
        const chapter = await Chapter.findById(req.params.id);

        if (chapter) {
            // Update title and unit
            chapter.title = title;
            chapter.unit = unitId;

            // Remove selected notes
            if (removeNotes) {
                const notesToRemove = Array.isArray(removeNotes) ? removeNotes : [removeNotes];
                chapter.notesPaths = chapter.notesPaths.filter(note => !notesToRemove.includes(note));
            }

            // Add new notes
            const newNotesPaths = req.files.map(file => `/uploads/${file.filename}`);
            chapter.notesPaths = chapter.notesPaths.concat(newNotesPaths);

            await chapter.save();
            req.flash('success_msg', 'Chapter updated successfully.');
            res.redirect('/admin/manageChapters');
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


// GET /admin/deleteChapter/:id
router.get('/deleteChapter/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            for (const filePath of chapter.notesPaths) {
                const fullPath = path.join(__dirname, '../', filePath);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error(err);
                });
            }
            await Chapter.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'Chapter deleted successfully.');
            res.redirect('/admin/manageChapters');
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});
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
        console.error(err);
        res.render('error/500');
    }
});

// POST /admin/addNotes/:id
router.post('/addNotes/:id', ensureAuthenticated, ensureAdmin, upload.array('notes', 10), async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            const notesPaths = req.files.map(file => `/uploads/${file.filename}`);

            // Check if notesPaths is defined before concatenation
            if (!chapter.notesPaths) {
                chapter.notesPaths = [];
            }
            chapter.notesPaths = chapter.notesPaths.concat(notesPaths);

            await chapter.save();
            req.flash('success_msg', 'Notes added successfully.');
            res.redirect('/admin/manageChapters');
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});
router.get('/deleteChapter/:id', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            for (const filePath of chapter.notesPaths) {
                const fullPath = path.join(__dirname, '../', filePath);
                fs.unlink(fullPath, (err) => {
                    if (err) console.error(err);
                });
            }
            await Chapter.findByIdAndDelete(req.params.id);
            req.flash('success_msg', 'Chapter deleted successfully.');
            res.redirect('/admin/manageChapters');
        } else {
            req.flash('error_msg', 'Chapter not found.');
            res.redirect('/admin/manageChapters');
        }
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});




module.exports = router;
