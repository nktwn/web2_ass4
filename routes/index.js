const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const animeResponse = await axios.get('https://api.jikan.moe/v4/top/anime');
        const topAnimes = animeResponse.data.data.slice(0, 4); // Берем первые 4 аниме

        const mangaResponse = await axios.get('https://api.jikan.moe/v4/top/manga');
        const topMangas = mangaResponse.data.data.slice(0, 4); // Берем первые 4 манги

        res.render('index', { topAnimes, topMangas });
    } catch (error) {
        console.error(error);
        res.render('index', { topAnimes: null, topMangas: null });
    }
});

module.exports = router;
