const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.get('/', (req, res) => {
    res.render('manga', { mangas: null });
});

router.get('/:id', async (req, res) => {
    const mangaId = req.params.id;
    const url = `https://api.jikan.moe/v4/manga/${mangaId}`;

    try {
        const response = await axios.get(url);
        const manga = response.data.data;
        res.render('manga-detail', { manga });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error retrieving manga details' });
    }
});
router.post('/', async (req, res) => {
    const query = req.body.query;
    const url = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        const mangas = response.data.data;
        res.render('manga', { mangas });
    } catch (error) {
        console.error(error);
        res.render('manga', { mangas: null, errorMessage: 'Error retrieving manga data' });
    }
});
router.post('/addToList', async (req, res) => {
    const { mangaId, title, image_url } = req.body;
    const decodedToken = jwt.decode(req.cookies.token);
    const userId = decodedToken.userId;
    try {
        await User.findByIdAndUpdate(userId, {
            $push: { mangaList: { mangaId, title, image_url, status: 'To Read' } }
        });
        res.redirect('/manga/' + mangaId);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;
