const Material = require('../models/Material');

exports.getMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        console.log(materials)
        res.render('materials/index', { materials });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

exports.showMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        res.render('materials/showMaterial', { material });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};