const express = require('express');
const router = express();

router.get('/', (req, res) => res.render('home'));
router.get('/upload', (req, res) => res.render('upload'));
router.get('/nhietdo', (req, res) => res.render('test_Q'));
router.get('/nhietdo1', (req, res) => res.render('test_Q1'));


module.exports = router;