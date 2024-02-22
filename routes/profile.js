const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { validatePasswordChange } = require('../utils/validation');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile');
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
    const { password, password2,password3 } = req.body;
    const decodedToken = jwt.decode(req.cookies.token);
    const id = decodedToken.userId;
    const validation = await validatePasswordChange(password, password2,password3,id);
    if (!validation.success) {
        
        return res.render('profile', { errorMessage: validation.message });

    }

    const hashedPassword = await bcrypt.hash(password2, 10);
    try {


        const user = await User.findOneAndUpdate({ _id: id }, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.render('profile', { successMessage: 'You change password' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error changing password');
    }
});

module.exports = router;
