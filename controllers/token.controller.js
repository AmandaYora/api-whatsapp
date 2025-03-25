const crypto = require('crypto');
const TokenService = require('../services/token.service');

const TokenController = {
  async create(req, res) {
    try {
      const { user_id, duration } = req.body;
      if (!user_id || !duration) {
        return res.status(400).json({
          success: false,
          message: 'user_id dan duration diperlukan',
          data: null
        });
      }
      const generatedToken = crypto.randomBytes(32).toString('hex');
      const expired_at = new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
      const status = 'active';
      const newToken = await TokenService.create({ user_id, token: generatedToken, status, expired_at });
      return res.status(201).json({
        success: true,
        message: 'Token berhasil dibuat',
        data: newToken
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Gagal membuat token',
        data: { error: error.message }
      });
    }
  },

  async getAll(req, res) {
    try {
      const tokens = await TokenService.findAll();
      return res.json({
        success: true,
        message: 'Daftar token',
        data: tokens
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil token',
        data: { error: error.message }
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const tokenData = await TokenService.findById(id);
      if (!tokenData) {
        return res.status(404).json({
          success: false,
          message: 'Token tidak ditemukan',
          data: null
        });
      }
      return res.json({
        success: true,
        message: 'Detail token',
        data: tokenData
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil token',
        data: { error: error.message }
      });
    }
  },

  async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      const tokens = await TokenService.findByUser(user_id);
      return res.json({
        success: true,
        message: 'Token untuk user ditemukan',
        data: tokens
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengambil token untuk user',
        data: { error: error.message }
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedToken = await TokenService.update(id, req.body);
      if (!updatedToken) {
        return res.status(404).json({
          success: false,
          message: 'Token tidak ditemukan',
          data: null
        });
      }
      return res.json({
        success: true,
        message: 'Token berhasil diupdate',
        data: updatedToken
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Gagal mengupdate token',
        data: { error: error.message }
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedToken = await TokenService.delete(id);
      if (!deletedToken) {
        return res.status(404).json({
          success: false,
          message: 'Token tidak ditemukan',
          data: null
        });
      }
      return res.json({
        success: true,
        message: 'Token berhasil dihapus',
        data: deletedToken
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Gagal menghapus token',
        data: { error: error.message }
      });
    }
  }
};

module.exports = TokenController;
