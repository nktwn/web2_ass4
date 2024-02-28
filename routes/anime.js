const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');


router.get('/', (req, res) => {
    res.render('anime', { animes: null });
});
router.get('/:id', async (req, res) => {
    const animeId = req.params.id;
    const url = `https://api.jikan.moe/v4/anime/${animeId}`;

    try {
        const response = await axios.get(url);
        const anime = response.data.data;
        res.render('anime-detail', { anime });
    } catch (error) {
        console.error(error);
        res.render('error', { message: 'Error retrieving anime details' });
    }
});

router.post('/', async (req, res) => {
    const query = req.body.query;
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        const animes = response.data.data;
        res.render('anime', { animes });
    } catch (error) {
        console.error(error);
        res.render('anime', { animes: null, errorMessage: 'Error retrieving anime data' });
    }
});
router.post('/addToList', async (req, res) => {
    const { animeId, title, image_url } = req.body;
    const decodedToken = jwt.decode(req.cookies.token);
    const userId = decodedToken.userId;
    try {
        await User.findByIdAndUpdate(userId, {
            $push: { animeList: { animeId, title, image_url, status: 'To Watch' } }
        });
        res.redirect('/anime/' + animeId); // Верните пользователя на страницу аниме
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = router;
