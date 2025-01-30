const express = require('express');
const { log } = require('../utils/logger')
const router = express.Router();

router.get('/', (req, res) => {
    try {
        const { invalid_number } = req.query;
        if (invalid_number) {
            res.render('index', {invalid_number});
            return;
        }
    } catch (err) {
        log('error', 'invalid number on index page', err);
    }
    res.render('index', {invalid_number: false});
});

module.exports = router;