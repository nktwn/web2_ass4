const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: String,
    type: { type: String, enum: ['anime', 'manga'] },
    items: [String]
});

module.exports = mongoose.model('Banner', bannerSchema);
