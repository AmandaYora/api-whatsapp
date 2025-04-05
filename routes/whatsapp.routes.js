const express = require('express');
const router = express.Router();
const WhatsAppController = require('../controllers/whatsapp.controller');
const bearerAuth = require('../middlewares/bearer.auth');

router.use(bearerAuth);

router.post('/init', WhatsAppController.init);
router.get('/get-qr', WhatsAppController.getQr);
router.post('/send-message', WhatsAppController.sendMessage);
router.post('/send-group-message', WhatsAppController.sendGroupMessage);
router.get('/get-groups', WhatsAppController.getGroups);
router.post('/logout', WhatsAppController.logout);
router.get('/check-status', WhatsAppController.checkStatus);
router.get('/get-messages', WhatsAppController.getMessages);

module.exports = router;