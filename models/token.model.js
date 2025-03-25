const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Token', {
    token_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      },
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active'
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
