const initializeSequelize = require('../config/database');

const db = {};

db.init = async () => {
  const sequelize = await initializeSequelize();
  db.sequelize = sequelize;
  db.User = require('./user.model')(sequelize);
  db.Device = require('./device.model')(sequelize);
  db.Message = require('./message.model')(sequelize);
  db.Webhook = require('./webhook.model')(sequelize);
  db.Token = require('./token.model')(sequelize);

  db.User.hasMany(db.Device, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  db.Device.belongsTo(db.User, { foreignKey: 'user_id' });
  
  db.Device.hasMany(db.Message, { foreignKey: 'device_id', onDelete: 'CASCADE' });
  db.Message.belongsTo(db.Device, { foreignKey: 'device_id' });
  
  db.User.hasMany(db.Webhook, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  db.Webhook.belongsTo(db.User, { foreignKey: 'user_id' });
  
  db.User.hasMany(db.Token, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  db.Token.belongsTo(db.User, { foreignKey: 'user_id' });

  await sequelize.sync({ alter: true });
  console.log('✅ Database tersinkronisasi');
};

module.exports = db;
