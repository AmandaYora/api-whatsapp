const db = require('../models');

const UserService = {
  async create(data) {
    return await db.User.create(data);
  },
  async findAll() {
    return await db.User.findAll();
  },
  async findById(id) {
    return await db.User.findByPk(id);
  },
  async findByEmail(email) {
    return await db.User.findOne({ where: { email } });
  },
  async update(id, data) {
    const user = await db.User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  },
  async delete(id) {
    const user = await db.User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }
};

module.exports = UserService;
