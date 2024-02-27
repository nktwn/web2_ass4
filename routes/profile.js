const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validatePasswordChange } = require('../utils/validation');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const decodedToken = jwt.decode(req.cookies.token);
        if (!decodedToken) {
            return res.redirect('/login');
        }

        const id = decodedToken.userId;
        const user = await User.findById(id);

        if (user) {
            res.render('profile', { user: user }); // Passing the user object to the template
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/delete', async (req, res) => {
    try {
        const decodedToken = jwt.decode(req.cookies.token);
        id = decodedToken.userId;
        await User.findOneAndDelete({ _id: id });

        res.clearCookie('token');


        res.redirect('/logout');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting user account');
    }
});

router.post('/pass', async (req, res) => {
    const { password, password2, password3 } = req.body;
    const decodedToken = jwt.decode(req.cookies.token);
    const id = decodedToken.userId;
    const validation = await validatePasswordChange(password, password2, password3, id);
    if (!validation.success) {
        // Здесь необходимо также загрузить данные пользователя
        const user = await User.findById(id);
        return res.render('profile', { user, errorMessage: validation.message });
    }

    const hashedPassword = await bcrypt.hash(password2, 10);
    try {
        const decodedToken = jwt.decode(req.cookies.token);
        const id = decodedToken.userId;
        const user = await User.findById(id);
        if (user) {
            return res.render('profile', { user, successMessage: 'You changed your password' });
        } else {
            return res.status(404).send("User not found");
        }


        return res.render('profile', { user, successMessage: 'You changed your password' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
