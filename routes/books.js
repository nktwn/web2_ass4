const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('books', { books: null });
});

router.post('/', async (req, res) => {
    const query = req.body.query;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(url);
        const books = response.data.items.map(book => ({
            title: book.volumeInfo.title,
            coverImage: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'path/to/default/image.jpg'
        }));

        res.render('books', { books });
    } catch (error) {
        console.error(error);
        res.render('books', { books: null, errorMessage: 'Error retrieving book data' });
    }
});

module.exports = router;
