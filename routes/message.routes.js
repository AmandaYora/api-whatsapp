const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/message.controller');
const bearerAuth = require('../middlewares/bearer.auth');

router.use(bearerAuth);

router.post('/', MessageController.create);
router.get('/', MessageController.getAll);
router.get('/:id', MessageController.getById);
router.delete('/:id', MessageController.delete);

module.exports = router;
