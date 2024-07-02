const express = require('express');
const router = express();

router.get('/', (req, res) => res.render('home'));
router.get('/upload', (req, res) => res.render('upload'));


module.exports = router;