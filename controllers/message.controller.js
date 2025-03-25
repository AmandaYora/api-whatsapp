const MessageService = require('../services/message.service');

const MessageController = {
  async create(req, res) {
    try {
      const message = await MessageService.create(req.body);
      return res.status(201).json({ success: true, message: 'Pesan berhasil dibuat', data: message });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal membuat pesan', data: null });
    }
  },

  async getAll(req, res) {
    try {
      const messages = await MessageService.findAll();
      return res.json({ success: true, message: 'Daftar pesan', data: messages });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil pesan', data: null });
    }
  },

  async getById(req, res) {
    try {
      const message = await MessageService.findById(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Detail pesan', data: message });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil pesan', data: null });
    }
  },

  async delete(req, res) {
    try {
      const message = await MessageService.delete(req.params.id);
      if (!message) return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Pesan berhasil dihapus', data: message });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal hapus pesan', data: null });
    }
  }
};

module.exports = MessageController;
