const { Device } = require('../models');

const DeviceService = {
  async create(data) {
    return await Device.create(data);
  },

  async findAll() {
    return await Device.findAll();
  },

  async findById(id) {
    return await Device.findByPk(id);
  },

  async findByUser(user_id) {
    return await Device.findAll({ where: { user_id } });
  },

  async update(id, data) {
    const device = await Device.findByPk(id);
    if (!device) return null;
    return await device.update(data);
  },

  async delete(id) {
    const device = await Device.findByPk(id);
    if (!device) return null;
    await device.destroy();
    return device;
  }
};

module.exports = DeviceService;
