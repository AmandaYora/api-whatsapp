const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhook.controller');
const bearerAuth = require('../middlewares/bearer.auth');

router.use(bearerAuth);

router.post('/', WebhookController.create);
router.get('/', WebhookController.getAll);
router.get('/:id', WebhookController.getById);
router.put('/:id', WebhookController.update);
router.delete('/:id', WebhookController.delete);

module.exports = router;
