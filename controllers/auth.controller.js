const bcrypt = require('bcrypt');
const crypto = require('crypto');
const UserService = require('../services/user.service');
const TokenService = require('../services/token.service');

const AuthController = {
  async register(req, res) {
    try {
      const { name, phone, email, username, password } = req.body;
      if (!name || !phone || !email || !username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Semua field wajib diisi',
          data: null
        });
      }

      const existingUser = await UserService.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar',
          data: null
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await UserService.create({
        name,
        phone,
        email,
        username,
        password: hashedPassword
      });

      return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: newUser
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Gagal registrasi',
        data: { error: error.message }
      });
    }
  },

  async login(req, res) {
    try {
      const { email, username, password } = req.body;
      if ((!email && !username) || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email/Username dan password wajib diisi',
          data: null
        });
      }

      const user = email
        ? await UserService.findByEmail(email)
        : await UserService.findByUsername(username);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
          data: null
        });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Password salah',
          data: null
        });
      }

      let tokenData = await TokenService.findActiveByUser(user.user_id);
      if (!tokenData) {
        const newToken = crypto.randomBytes(32).toString('hex');
        const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        tokenData = await TokenService.create({
          user_id: user.user_id,
          token: newToken,
          status: 'active',
          expired_at: expiredAt
        });
      }

      req.session.token = tokenData.token;

      return res.json({
        success: true,
        message: 'Login berhasil',
        data: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          username: user.username,
          token: tokenData.token
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Gagal login',
        data: { error: error.message }
      });
    }
  },

  async logout(req, res) {
    req.session.destroy(() => {
      return res.json({
        success: true,
        message: 'Logout berhasil',
        data: null
      });
    });
  }
};

module.exports = AuthController;
