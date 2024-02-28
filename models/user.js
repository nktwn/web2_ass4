const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    favoriteAnime: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    animeList: [{
        animeId: String,
        title: String,
        image_url: String,
        status: { type: String, default: 'To Watch' }
    }],
    mangaList: [{
        mangaId: String,
        title: String,
        image_url: String,
        status: { type: String, default: 'To Read' }
    }]
});
module.exports = mongoose.model('users', userSchema);
