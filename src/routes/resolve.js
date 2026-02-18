const express = require('express');
const resolveController = require('../controllers/resolveController');
const router = express.Router();

router.get('/:key', resolveController.resolve);

module.exports = router;
