const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const Material = require('../models/Material');
const User = require('../models/User');
const upload = require('../middleware/multer');
const fs = require('fs');
const flash = require('connect-flash');
const path = require('path');

// GET /admin/manageMaterials
router.get('/', ensureAuthenticated, ensureAdmin, async (req, res) => {
    try {
        const materials = await User.find().lean();
        res.render('admin/admin', { materials });
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
router.get('/addMaterial', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/addMaterial');
});

// POST /admin/addMaterial
router.post('/addMaterial', ensureAuthenticated, ensureAdmin, upload.single('pdf'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const pdfPath = `/uploads/${req.file.filename}`; // Corrected line
        await Material.create({ title, description, pdfPath });
        res.redirect('/admin/manageMaterials');
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


module.exports = router;
