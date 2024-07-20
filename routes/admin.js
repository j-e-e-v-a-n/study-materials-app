const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const Material = require('../models/Material');
const upload = require('../middleware/multer');
const fs = require('fs');
const path = require('path');

// GET /admin/manageMaterials
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

module.exports = router;
