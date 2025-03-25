const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Message', {
    message_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    device_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    from_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('text', 'image', 'video', 'document', 'sticker'),
      defaultValue: 'text'
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
      defaultValue: 'sent'
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'messages',
    timestamps: false
  });
};
