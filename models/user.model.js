const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
