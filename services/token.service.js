const { Token } = require('../models');

const TokenService = {
  async create(data) {
    return await Token.create(data);
  },

  async findAll() {
    return await Token.findAll();
  },

  async findById(id) {
    return await Token.findByPk(id);
  },

  async findByUser(user_id) {
    return await Token.findAll({ where: { user_id } });
  },

  async findByToken(tokenValue) {
    return await Token.findOne({ where: { token: tokenValue, status: 'active' } });
  },

  async findActiveByUser(user_id) {
    return await Token.findOne({
      where: {
        user_id,
        status: 'active'
      },
      order: [['expired_at', 'DESC']]
    });
  },  

  async update(id, data) {
    const token = await Token.findByPk(id);
    if (!token) return null;
    return await token.update(data);
  },

  async delete(id) {
    const token = await Token.findByPk(id);
    if (!token) return null;
    await token.destroy();
    return token;
  }
};

module.exports = TokenService;
