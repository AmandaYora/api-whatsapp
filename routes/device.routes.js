const express = require('express');
const router = express.Router();
const DeviceController = require('../controllers/device.controller');
const bearerAuth = require('../middlewares/bearer.auth');

router.use(bearerAuth);

router.post('/', DeviceController.create);
router.get('/', DeviceController.getAll);
router.get('/:id', DeviceController.getById);
router.put('/:id', DeviceController.update);
router.delete('/:id', DeviceController.delete);

module.exports = router;
