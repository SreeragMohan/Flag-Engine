const express = require('express');
const overridesController = require('../controllers/overridesController');
const router = express.Router({ mergeParams: true });

router.get('/', overridesController.listOverrides);
router.put('/:type/:targetId', overridesController.setOverride);
router.delete('/:type/:targetId', overridesController.deleteOverride);

module.exports = router;
