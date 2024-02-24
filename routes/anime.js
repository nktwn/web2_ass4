const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('anime', { animes: null });
});


router.post('/', async (req, res) => {
    const query = req.body.query;
    // Обновите URL для соответствия новому эндпойнту API Jikan v4
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        // Обновите структуру ответа в соответствии с новым форматом API
        const animes = response.data.data; // Обратите внимание на изменение доступа к данным
        res.render('anime', { animes });
    } catch (error) {
        console.error(error);
        res.render('anime', { animes: null, errorMessage: 'Error retrieving anime data' });
    }
});



module.exports = router;
