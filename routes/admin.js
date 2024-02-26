const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { validateRegistration } = require('../utils/validation');
const Banner = require('../models/banner');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const banners = await Banner.find();
        res.render('admin', { users, banners });
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Error fetching data' });
    }
});

router.post('/create', async (req, res) => {
    const { username, password, password2 } = req.body;
    const users = await User.find();

    const validationResult = await validateRegistration(username, password, password2);
    if (!validationResult.success) {
        return res.render('admin', { users, errorMessage: validationResult.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    try {
        await user.save();
        return res.redirect('/admin');
    } catch (error) {
        console.error(error);
        return res.render('admin', { users, errorMessage: error.message });
    }
});

router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const users = await User.find();
    try {
        await User.findByIdAndDelete(id);
        return res.redirect('/admin');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: 'Error deleting user' });
    }
});

router.post('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { newUsername, password, isAdmin } = req.body;

    try {
        let updateData = {};

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        if (newUsername) {
            updateData.username = newUsername;
        }

        updateData.isAdmin = isAdmin === "on";

        await User.findByIdAndUpdate(id, updateData);
        return res.redirect('/admin');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errorMessage: 'Error updating user' });
    }
});
router.post('/create-banner', async (req, res) => {
    try {
        const { title, type, items } = req.body;
        const itemIDs = items.split(',').map(id => id.trim());


        const banner = new Banner({ title, type, items: itemIDs });
        await banner.save();

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating banner');
    }
});

router.post('/update-banner/:id', async (req, res) => {
    const { id } = req.params;
    const { title, type, items } = req.body;
    const itemIDs = items.split(',').map(item => item.trim()); // Преобразование строки в массив

    try {
        await Banner.findByIdAndUpdate(id, { title, type, items: itemIDs });
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Error updating banner' });
    }
});


router.post('/delete-banner/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (id !== 'ID_FOR_TOP_ANIME' && id !== 'ID_FOR_TOP_MANGA') {
            await Banner.findByIdAndDelete(id);
        }
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Error deleting banner' });
    }
});
module.exports = router;
