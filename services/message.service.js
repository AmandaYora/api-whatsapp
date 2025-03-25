const { Message } = require('../models');
const { sendMessage } = require('./whatsapp.service');

const MessageService = {
  async create(data) {
    await sendMessage(data.device_id, data.to_number, data.message);
    return await Message.create(data);
  },

  async findAll() {
    return await Message.findAll();
  },

  async findById(id) {
    return await Message.findByPk(id);
  },

  async findByDevice(device_id) {
    return await Message.findAll({ where: { device_id } });
  },

  async delete(id) {
    const message = await Message.findByPk(id);
    if (!message) return null;
    await message.destroy();
    return message;
  }
};

module.exports = MessageService;
