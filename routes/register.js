const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validateRegistration } = require('../utils/validation'); 



const router = express.Router();

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/', async (req, res) => {
    const { username, password, password2, phoneNumber, age, favoriteAnime } = req.body;
    const validationResult = await validateRegistration(username, password, password2); // Обновите эту функцию для валидации новых полей
    if (!validationResult.success) {
        return res.status(400).render('register', { errorMessage: validationResult.message, username, password, password2, phoneNumber, age, favoriteAnime });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, phoneNumber, age, favoriteAnime });

    try {
        await user.save();
        return res.render('register', { successMessage: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).render('register', { errorMessage: 'Error registering user', username });
    }
});

module.exports = router;
