const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('manga', { mangas: null });
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

module.exports = router;
