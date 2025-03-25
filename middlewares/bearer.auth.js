const TokenService = require('../services/token.service');

const bearerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Bearer token required',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];

    if (!req.session.token || req.session.token !== token) {
      return res.status(401).json({
        success: false,
        message: 'Silakan login terlebih dahulu',
        data: null
      });
    }    

    const tokenData = await TokenService.findByToken(token);

    if (!tokenData) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        data: null
      });
    }

    if (new Date(tokenData.expired_at) < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        data: null
      });
    }

    req.user_id = tokenData.user_id;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying token',
      data: { error: error.message }
    });
  }
};

module.exports = bearerAuth;
