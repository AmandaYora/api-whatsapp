const {
  jsonResponse,
  createClient,
  sendMessage,
  getQRCode,
  logout,
  checkStatus,
  getReceivedMessages
} = require('../services/whatsapp.service');
const DeviceService = require('../services/device.service');

const WhatsAppController = {
  async init(req, res) {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json(jsonResponse(false, 'deviceId diperlukan'));
    }
    const device = await DeviceService.findById(deviceId);
    if (!device) {
      return res.status(404).json(jsonResponse(false, 'Device tidak ditemukan'));
    }
    try {
      createClient(deviceId, false);
      return res.json(jsonResponse(true, 'Inisialisasi client dimulai', { deviceId }));
    } catch (error) {
      return res.status(500).json(jsonResponse(false, 'Gagal inisialisasi client', { error: error.message }));
    }
  },

  getQr(req, res) {
    const { deviceId } = req.query;
    if (!deviceId) {
      return res.status(400).json(jsonResponse(false, 'deviceId diperlukan'));
    }
    const qrData = getQRCode(deviceId);
    if (qrData.success) {
      return res.json(jsonResponse(true, 'QR Code tersedia', qrData));
    }
    return res.json(jsonResponse(false, qrData.message));
  },

  async sendMessage(req, res) {
    const { deviceId, number, message } = req.body;
    if (!deviceId || !message) {
      return res.status(400).json(jsonResponse(false, 'deviceId dan message diperlukan'));
    }
    const numbers = Array.isArray(number) ? number : [number];
    try {
      for (const n of numbers) {
        await sendMessage(deviceId, n, message);
      }
      return res.json(jsonResponse(true, 'Pesan terkirim'));
    } catch (error) {
      return res.status(500).json(jsonResponse(false, 'Gagal mengirim pesan', { error: error.message }));
    }
  },

  async logout(req, res) {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json(jsonResponse(false, 'deviceId diperlukan'));
    }
    try {
      await logout(deviceId);
      return res.json(jsonResponse(true, 'Berhasil logout', { deviceId }));
    } catch (error) {
      return res.status(500).json(jsonResponse(false, 'Gagal logout', { error: error.message }));
    }
  },

  checkStatus(req, res) {
    const { deviceId } = req.query;
    if (!deviceId) {
      return res.status(400).json(jsonResponse(false, 'deviceId diperlukan'));
    }
    const status = checkStatus(deviceId);
    return res.json(status);
  },

  getMessages(req, res) {
    const { deviceId } = req.query;
    if (!deviceId) {
      return res.status(400).json(jsonResponse(false, 'deviceId diperlukan'));
    }
    const messages = getReceivedMessages(deviceId);
    return res.json(jsonResponse(true, 'Pesan ditemukan', messages));
  }
};

module.exports = WhatsAppController;
