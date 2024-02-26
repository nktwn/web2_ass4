const express = require('express');
const axios = require('axios');
const Banner = require('../models/banner'); // Подключение модели баннера
const router = express.Router();

// Функция для получения данных об аниме или манге по их идентификаторам
async function getMediaData(type, ids) {
    const baseUrl = type === 'anime' ? 'https://api.jikan.moe/v4/anime/' : 'https://api.jikan.moe/v4/manga/';
    const mediaData = [];

    for (const id of ids) {
        try {
            const url = baseUrl + id.trim();
            const response = await axios.get(url);
            mediaData.push(response.data.data);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 секунда
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

        // Получение баннеров из базы данных
        const banners = await Banner.find();
        console.log("Баннеры: ", banners); // Логирование полученных баннеров

        // Для каждого баннера получаем данные об аниме или манге
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
