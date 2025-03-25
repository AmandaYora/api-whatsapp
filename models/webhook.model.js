const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Webhook', {
    webhook_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    event: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'webhooks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
};
