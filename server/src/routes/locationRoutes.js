const express = require('express');
const router = express.Router();
const { getMetaData } = require('../controllers/locationController');

router.get('/meta', getMetaData);

module.exports = router;
