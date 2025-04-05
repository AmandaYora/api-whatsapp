const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode');
const DeviceService = require('./device.service');

const clients = {};
const QR_DURATION = 60000;
const jsonResponse = (success, message, data = []) => ({ success, message, data });

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function createClient(deviceId, awaitInit = true) {
  if (clients[deviceId]) {
    if (awaitInit && clients[deviceId].initializing) {
      await clients[deviceId].initializing;
    }
    return clients[deviceId];
  }
  const sessionPath = path.join(__dirname, '../sessions', deviceId);
  if (!fs.existsSync(sessionPath)) {
    fs.mkdirSync(sessionPath, { recursive: true });
    console.log(`Folder sesi dibuat di ${sessionPath}`);
  }
  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: sessionPath,
      clientId: deviceId
    }),
    puppeteer: {
      headless: true,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });
  let resolveInitialization;
  const initializing = new Promise((resolve) => {
    resolveInitialization = resolve;
  });
  clients[deviceId] = {
    client,
    initializing,
    qrCodeData: null,
    qrExpiryTime: null,
    ready: false,
    messages: []
  };
  client.on('qr', (qr) => {
    qrcode.toDataURL(qr, (err, url) => {
      if (err) {
        console.error(`Gagal membuat QR Code untuk device ${deviceId}:`, err);
      } else {
        clients[deviceId].qrCodeData = url;
        clients[deviceId].qrExpiryTime = Date.now() + QR_DURATION;
      }
    });
  });
  client.on('message', (msg) => {
    clients[deviceId].messages.push({
      from: msg.from,
      author: msg.author || null,
      body: msg.body,
      timestamp: msg.timestamp
    });
  });
  
  client.on('ready', async () => {
    console.log(`Client untuk device ${deviceId} sudah siap`);
    clients[deviceId].qrCodeData = null;
    clients[deviceId].qrExpiryTime = null;
    clients[deviceId].ready = true;
    try {
      await DeviceService.update(deviceId, { is_active: true, session_data: 'connected' });
    } catch (error) {
      console.error(`Gagal mengupdate status device ${deviceId}:`, error);
    }
    resolveInitialization();
  });
  client.on('auth_failure', (msg) => {
    console.error(`Gagal otentikasi untuk device ${deviceId}:`, msg);
    delete clients[deviceId];
    resolveInitialization();
  });
  client.on('disconnected', (reason) => {
    console.log(`Device ${deviceId} terputus: ${reason}`);
    if (reason === 'LOGOUT') {
      const sessionPath = path.join(__dirname, '../sessions', deviceId);
      try {
        if (fs.existsSync(sessionPath)) {
          fs.rmSync(sessionPath, { recursive: true, force: true });
          console.log(`Sesi untuk device ${deviceId} dihapus setelah logout`);
        }
      } catch (error) {
        console.error(`Gagal menghapus sesi setelah logout untuk device ${deviceId}:`, error);
      }
      delete clients[deviceId];
      createClient(deviceId, false)
        .then(() => console.log(`Client untuk device ${deviceId} berhasil direinitialize setelah logout`))
        .catch((err) => console.error(`Gagal reinitialize client ${deviceId}:`, err));
    } else {
      client.initialize().catch((err) => {
        console.error(`Error during reinitialization for device ${deviceId}:`, err);
      });
    }
  });
  client.initialize().catch((err) => {
    console.error(`Error during initial client initialization untuk device ${deviceId}:`, err);
  });
  if (awaitInit) {
    await initializing;
  }
  return clients[deviceId];
}

async function sendMessage(deviceId, number, message) {
  const c = await createClient(deviceId, true);
  return await c.client.sendMessage(`${number}@c.us`, message);
}

async function sendGroupMessage(deviceId, groupId, message) {
  const c = await createClient(deviceId, true);
  let formattedGroupId = groupId;
  if (!groupId.endsWith('@g.us')) {
    formattedGroupId = `${groupId}@g.us`;
  }
  try {
    const result = await c.client.sendMessage(formattedGroupId, message);
    return result;
  } catch (error) {
    console.error(`Gagal mengirim pesan ke grup untuk device ${deviceId}:`, error);
    return jsonResponse(false, "Gagal mengirim pesan ke grup");
  }
}

function getQRCode(deviceId) {
  const c = clients[deviceId];
  if (c && c.qrCodeData && c.qrExpiryTime && Date.now() < c.qrExpiryTime) {
    const timeLeft = Math.floor((c.qrExpiryTime - Date.now()) / 1000);
    return { success: true, qrcode: c.qrCodeData, duration: timeLeft };
  }
  return { success: false, message: 'Tidak ada QR Code tersedia atau sudah kadaluarsa' };
}

async function logout(deviceId) {
  if (!clients[deviceId]) return;
  try {
    await clients[deviceId].client.logout();
  } catch (error) {
    console.error(`Gagal logout device ${deviceId}:`, error);
  }
  const sessionPath = path.join(__dirname, '../sessions', deviceId);
  if (fs.existsSync(sessionPath)) {
    try {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      console.log(`Sesi untuk device ${deviceId} dihapus`);
    } catch (error) {
      console.error(`Gagal menghapus sesi untuk device ${deviceId}:`, error);
    }
  }
  delete clients[deviceId];
}

function checkStatus(deviceId) {
  if (clients[deviceId]) {
    return {
      success: true,
      status: clients[deviceId].ready ? 'connected' : 'initializing'
    };
  }
  return { success: false, status: 'not_initialized' };
}

function formatTimestamp(ts) {
  return new Date(ts * 1000).toLocaleString('id-ID', { hour12: false });
}

function getReceivedMessages(deviceId) {
  const c = clients[deviceId];
  if (!c || !c.messages) return { chat: [], group: [], status: [] };

  const chatMessages = [];
  const groupMessages = [];
  const statusMessages = [];

  c.messages.forEach(msg => {
    const formattedMsg = { ...msg, readableTimestamp: formatTimestamp(msg.timestamp) };
    if (msg.from.includes('@g.us')) {
      groupMessages.push(formattedMsg);
    } else if (msg.from.includes('status@broadcast')) {
      statusMessages.push(formattedMsg);
    } else if (msg.from.includes('@c.us')) {
      chatMessages.push({ ...formattedMsg, from: msg.from.replace('@c.us', '') });
    } else {
      chatMessages.push(formattedMsg);
    }
  });

  chatMessages.sort((a, b) => b.timestamp - a.timestamp);
  groupMessages.sort((a, b) => b.timestamp - a.timestamp);
  statusMessages.sort((a, b) => b.timestamp - a.timestamp);

  return { chat: chatMessages, group: groupMessages, status: statusMessages };
}

function getGroupList(deviceId) {
  const c = clients[deviceId];
  if (c && c.messages) {
    const groupMessages = c.messages.filter(msg => msg.from.includes('@g.us'));
    const groups = groupMessages.reduce((acc, msg) => {
      const formattedMsg = { ...msg, readableTimestamp: formatTimestamp(msg.timestamp) };
      if (!acc[msg.from]) {
        acc[msg.from] = { from: msg.from, messages: [formattedMsg] };
      } else {
        acc[msg.from].messages.push(formattedMsg);
      }
      return acc;
    }, {});
    Object.keys(groups).forEach(groupId => {
      groups[groupId].messages.sort((a, b) => b.timestamp - a.timestamp);
    });
    return jsonResponse(true, "Daftar grup berhasil diambil", Object.values(groups));
  }
  return jsonResponse(false, "Grup tidak tersedia");
}


module.exports = {
  jsonResponse,
  createClient,
  sendMessage,
  sendGroupMessage,
  getQRCode,
  logout,
  checkStatus,
  getReceivedMessages,
  getGroupList
};
