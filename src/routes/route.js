const express = require('express');
const ulrController = require("../controllers/ulrController.js")

const router = express.Router();

router.post('/url/shorten', ulrController.createShortUrl);
router.get('/:urlcode', ulrController.urlRedirection);

module.exports = router;
