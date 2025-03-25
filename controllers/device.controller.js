const DeviceService = require('../services/device.service');

const DeviceController = {
  async create(req, res) {
    try {
      const device = await DeviceService.create(req.body);
      return res.status(201).json({ success: true, message: 'Device berhasil dibuat', data: device });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal membuat device', data: null });
    }
  },

  async getAll(req, res) {
    try {
      const devices = await DeviceService.findAll();
      return res.json({ success: true, message: 'Daftar device', data: devices });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil device', data: null });
    }
  },

  async getById(req, res) {
    try {
      const device = await DeviceService.findById(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: 'Device tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Detail device', data: device });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil device', data: null });
    }
  },

  async update(req, res) {
    try {
      const device = await DeviceService.update(req.params.id, req.body);
      if (!device) return res.status(404).json({ success: false, message: 'Device tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Device berhasil diupdate', data: device });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal update device', data: null });
    }
  },

  async delete(req, res) {
    try {
      const device = await DeviceService.delete(req.params.id);
      if (!device) return res.status(404).json({ success: false, message: 'Device tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Device berhasil dihapus', data: device });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal hapus device', data: null });
    }
  }
};

module.exports = DeviceController;
