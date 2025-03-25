const UserService = require('../services/user.service');

const hidePassword = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user.dataValues || user;
  return safeUser;
};

const UserController = {
  async create(req, res) {
    try {
      const { name, phone, email, username, password } = req.body;

      if (!name || !phone || !email || !username || !password) {
        return res.status(400).json({ success: false, message: 'Semua field wajib diisi', data: null });
      }

      const isExist = await UserService.findByEmail(email);
      if (isExist) {
        return res.status(409).json({ success: false, message: 'Email sudah terdaftar', data: null });
      }

      const user = await UserService.create({ name, phone, email, username, password });
      return res.status(201).json({ success: true, message: 'User berhasil dibuat', data: hidePassword(user) });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Gagal membuat user', data: null });
    }
  },

  async getAll(req, res) {
    try {
      const users = await UserService.findAll();
      const safeUsers = users.map(hidePassword);
      return res.json({ success: true, message: 'Daftar user', data: safeUsers });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil user', data: null });
    }
  },

  async getById(req, res) {
    try {
      const user = await UserService.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan', data: null });
      return res.json({ success: true, message: 'Detail user', data: hidePassword(user) });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal mengambil user', data: null });
    }
  },

  async update(req, res) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan', data: null });
      return res.json({ success: true, message: 'User berhasil diupdate', data: hidePassword(user) });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal update user', data: null });
    }
  },

  async delete(req, res) {
    try {
      const user = await UserService.delete(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan', data: null });
      return res.json({ success: true, message: 'User berhasil dihapus', data: hidePassword(user) });
    } catch {
      return res.status(500).json({ success: false, message: 'Gagal hapus user', data: null });
    }
  }
};

module.exports = UserController;
