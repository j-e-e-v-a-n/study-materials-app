const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');
const Material = require('../models/Material');

// GET /materials
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const materials = await Material.find().lean();
        res.render('materials/index', { materials });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

// GET /materials/:id
router.get('/:id', async (req, res) => {
    try {
        const material = await Material.findById(req.params.id).lean();
        if (!material) {
            return res.render('error/404');
        }
        res.render('materials/showMaterial', { material });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

module.exports = router;