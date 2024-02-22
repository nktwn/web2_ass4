const express = require('express');
const axios = require('axios');
const router = express.Router();

let searchHistory = [];

router.get('/', (req, res) => {
    res.render('weather', { weatherData: null, history: searchHistory });
});

router.post('/', async (req, res) => {
    const city = req.body.city;
    const apiKey = '5291eefa398029c38b952d4a10671a3e';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        const weatherData = {
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            iconUrl: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`,
            coordinates: response.data.coord,
            feelsLike: response.data.main.feels_like,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            windSpeed: response.data.wind.speed,
            countryCode: response.data.sys.country,
            rainVolume: response.data.rain ? response.data.rain['3h'] : 'No rain data'
        };

        const searchRecord = { city, time: new Date().toISOString() };
        searchHistory.push(searchRecord);

        res.render('weather', { weatherData, history: searchHistory });
    } catch (error) {
        console.error(error);
        res.render('weather', { weatherData: null, errorMessage: 'Error retrieving weather data', history: searchHistory });
    }
});

module.exports = router;
