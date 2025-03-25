const express = require('express');
const session = require('express-session');
const app = express();
require('dotenv').config();

const db = require('./models');

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_default_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

db.init()
  .then(() => {
    const userRoutes = require('./routes/user.routes');
    const deviceRoutes = require('./routes/device.routes');
    const messageRoutes = require('./routes/message.routes');
    const webhookRoutes = require('./routes/webhook.routes');
    const whatsappRoutes = require('./routes/whatsapp.routes');
    const tokenRoutes = require('./routes/token.routes');
    const authRoutes = require('./routes/auth.routes');

    app.use('/api/users', userRoutes);
    app.use('/api/devices', deviceRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/webhooks', webhookRoutes);
    app.use('/api/whatsapp', whatsappRoutes);
    app.use('/api/tokens', tokenRoutes);
    app.use('/api/auth', authRoutes);

    app.get('/', (req, res) => {
      res.json({ success: true, message: 'API WhatsApp Multi-User aktif 🚀', data: null });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Gagal menginisialisasi models:', error);
    process.exit(1);
  });
