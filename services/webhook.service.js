const { Webhook } = require('../models');

const WebhookService = {
  async create(data) {
    return await Webhook.create(data);
  },

  async findAll() {
    return await Webhook.findAll();
  },

  async findById(id) {
    return await Webhook.findByPk(id);
  },

  async findByUser(user_id) {
    return await Webhook.findAll({ where: { user_id } });
  },

  async update(id, data) {
    const webhook = await Webhook.findByPk(id);
    if (!webhook) return null;
    return await webhook.update(data);
  },

  async delete(id) {
    const webhook = await Webhook.findByPk(id);
    if (!webhook) return null;
    await webhook.destroy();
    return webhook;
  }
};

module.exports = WebhookService;
