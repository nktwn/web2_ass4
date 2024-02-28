const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const animeRoutes = require('./routes/anime');
const mangaRoutes = require('./routes/manga');
const { verifyToken, redirectToHomeIfLoggedIn, ifAdmin } = require('./utils/auth');
const app = express();
const i18n = require("i18n");

i18n.configure({
    locales: ['en', 'ru'],
    directory: __dirname + '/locales',
    defaultLocale: 'en',
    cookie: 'lang',
});

app.use(i18n.init);




mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch(err => console.error(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use((req, res, next) => {
    if (req.cookies.lang) {
        req.setLocale(req.cookies.lang);
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => { 
    res.locals.loggedIn = req.cookies.token ? true : false;
    if (req.cookies.token) {
        const decodedToken = jwt.decode(req.cookies.token);
        res.locals.username = decodedToken.username;
        res.locals.admin = decodedToken.isAdmin ? true : false;
    } else {
        res.locals.admin = false;
    }
    next();
});


app.use('/login', redirectToHomeIfLoggedIn, require('./routes/login'));
app.use('/register', redirectToHomeIfLoggedIn, require('./routes/register'));
app.use('/', verifyToken, require('./routes/index'));
app.use('/logout', verifyToken, require('./routes/logout'));
app.use('/anime', animeRoutes);
app.use('/manga', mangaRoutes);
app.use('/profile', verifyToken, require('./routes/profile'));
app.use('/admin', verifyToken, ifAdmin, require('./routes/admin'));
app.get('/change-lang/:lang', (req, res) => {
    res.cookie('lang', req.params.lang, { maxAge: 900000, httpOnly: true });
    res.redirect('back');
});

app.use((req, res, next) => {
    res.status(404).send('<center><h1>404 Not Found</h1></center>'); 
    next();
});

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});
