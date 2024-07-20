const Material = require('./models/Material');

exports.addMaterialForm = (req, res) => {
    res.render('admin/addMaterial');
};

exports.addMaterial = async (req, res) => {
    const { title, description, content } = req.body;
    try {
        const newMaterial = new Material({ title, description, content });
        await newMaterial.save();
        res.redirect('/admin/manageMaterials');
    } catch (err) {
        console.error(err);
        res.render('admin/addMaterial', { error: 'Something went wrong' });
    }
};

exports.editMaterialForm = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        res.render('admin/editMaterial', { material });
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manageMaterials');
    }
};

exports.editMaterial = async (req, res) => {
    const { title, description, content } = req.body;
    try {
        await Material.findByIdAndUpdate(req.params.id, { title, description, content });
        res.redirect('/admin/manageMaterials');
    } catch (err) {
        console.error(err);
        res.render('admin/editMaterial', { error: 'Something went wrong' });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        await Material.findByIdAndRemove(req.params.id);
        res.redirect('/admin/manageMaterials');
    } catch (err) {
        console.error(err);
        res.redirect('/admin/manageMaterials');
    }
};

exports.manageMaterials = async (req, res) => {
    try {
        const materials = await Material.find();
        res.render('admin/manageMaterials', { materials });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};