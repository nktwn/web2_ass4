const express = require('express');
const axios = require('axios');
const Banner = require('../models/banner');
const router = express.Router();

async function getMediaData(type, ids) {
    const baseUrl = type === 'anime' ? 'https://api.jikan.moe/v4/anime/' : 'https://api.jikan.moe/v4/manga/';
    const mediaData = [];

    for (const id of ids) {
        try {
            const url = baseUrl + id.trim();
            const response = await axios.get(url);
            mediaData.push(response.data.data);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`Ошибка при запросе к API для ID ${id}: `, error);
        }
    }

    return mediaData;
}



router.get('/', async (req, res) => {
    try {
        const animeResponse = await axios.get('https://api.jikan.moe/v4/top/anime');
        const mangaResponse = await axios.get('https://api.jikan.moe/v4/top/manga');

        const topAnimes = animeResponse.data.data;
        const topMangas = mangaResponse.data.data;

        const banners = await Banner.find();
        console.log("Баннеры: ", banners);

        for (let banner of banners) {
            banner.mediaData = await getMediaData(banner.type, banner.items);
        }

        res.render('index', { topAnimes, topMangas, banners });
    } catch (error) {
        console.error(error);
        res.render('index', { topAnimes: [], topMangas: [], banners: [] });
    }
});

module.exports = router;
