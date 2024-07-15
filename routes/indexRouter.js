const express = require('express');
const router = express();

router.get('/', (req, res) => res.render('home'));
router.get('/upload', (req, res) => res.render('upload'));
router.get('/nhietdo', (req, res) => res.render('test_Q'));
router.get('/dulieu', (req, res) => res.render('test_Q1'));
 

router.use("/api_data", require("./api_data"));
router.use("/api_import", require("./api_import"));

module.exports = router;