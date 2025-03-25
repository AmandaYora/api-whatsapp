const WebhookService = require('../services/webhook.service');

const WebhookController = {
  async create(req, res) {
    try {
      const webhook = await WebhookService.create(req.body);
      return res.status(201).json({ success: true, message: 'Webhook berhasil dibuat', data: webhook });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal membuat webhook', data: null });
    }
  },

  async getAll(req, res) {
    try {
      const webhooks = await WebhookService.findAll();
      return res.json({ success: true, message: 'Daftar webhook', data: webhooks });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil webhook', data: null });
    }
  },

  async getById(req, res) {
    try {
      const webhook = await WebhookService.findById(req.params.id);
      if (!webhook) return res.status(404).json({ success: false, message: 'Webhook tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Detail webhook', data: webhook });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil webhook', data: null });
    }
  },

  async update(req, res) {
    try {
      const webhook = await WebhookService.update(req.params.id, req.body);
      if (!webhook) return res.status(404).json({ success: false, message: 'Webhook tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Webhook berhasil diupdate', data: webhook });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal update webhook', data: null });
    }
  },

  async delete(req, res) {
    try {
      const webhook = await WebhookService.delete(req.params.id);
      if (!webhook) return res.status(404).json({ success: false, message: 'Webhook tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Webhook berhasil dihapus', data: webhook });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal hapus webhook', data: null });
    }
  }
};

module.exports = WebhookController;
