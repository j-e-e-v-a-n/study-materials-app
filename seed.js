const mongoose = require('mongoose');
const Material = require('./models/Material'); // Adjust the path to your model

mongoose.connect('mongodb+srv://user:ADhL0KH37CX52xV2@cluster0.cvupke0.mongodb.net/study-materials', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('Connected to MongoDB');

    const materials = [
        {
            title: "Introduction to Programming",
            description: "A comprehensive guide to the basics of programming, covering various programming languages and techniques.",
            pdfPath: "/uploads/intro_programming.pdf"
        },
        {
            title: "Advanced JavaScript",
            description: "An in-depth exploration of advanced JavaScript concepts, including closures, promises, and async/await.",
            pdfPath: "/uploads/advanced_javascript.pdf"
        },
        {
            title: "Web Development Essentials",
            description: "A guide covering essential topics for web development, including HTML, CSS, and JavaScript fundamentals.",
            pdfPath: "/uploads/web_dev_essentials.pdf"
        }
    ];

    await Material.insertMany(materials);
    console.log('Sample data inserted');
    mongoose.disconnect();
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
