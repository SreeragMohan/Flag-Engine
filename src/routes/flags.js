const express = require('express');
const flagsController = require('../controllers/flagsController');
const router = express.Router();

router.get('/', flagsController.listFlags);
router.get('/:key', flagsController.getFlag);
router.post('/', flagsController.createFlag);
router.put('/:key', flagsController.updateFlag);
router.delete('/:key', flagsController.deleteFlag);

module.exports = router;
