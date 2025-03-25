const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Device', {
    device_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_data: DataTypes.TEXT,
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'devices',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
