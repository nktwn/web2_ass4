const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('anime', { animes: null });
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



module.exports = router;
