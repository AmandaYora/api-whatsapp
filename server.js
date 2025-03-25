const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Konfigurasi Express
const app = express();
app.use(express.json());

// Direktori untuk menyimpan sesi autentikasi
const SESSION_DIR = path.join(__dirname, 'sessions');

// Membuat folder 'sessions' jika belum ada
if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
    console.log('Folder sessions dibuat.');
}

// Inisialisasi client WhatsApp dengan LocalAuth di folder 'sessions'
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: SESSION_DIR,
        clientId: "whatsapp-api"
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

let qrCodeData = null;
let qrExpiryTime = null;
const QR_DURATION = 60; // QR berlaku selama 60 detik

// Menampilkan QR code di terminal dan menyimpannya untuk API
client.on('qr', (qr) => {
    console.log('Scan QR ini untuk terhubung ke WhatsApp');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Gagal membuat QR Code:', err);
        } else {
            qrCodeData = url;
            qrExpiryTime = Date.now() + QR_DURATION * 1000; // Menetapkan waktu kadaluarsa
        }
    });
});

// Log ketika WhatsApp terhubung
client.on('ready', () => {
    console.log('WhatsApp terhubung!');
    qrCodeData = null;
    qrExpiryTime = null;
});

// Log jika terjadi kegagalan autentikasi
client.on('auth_failure', msg => {
    console.error('Gagal otentikasi', msg);
});

// Log jika koneksi terputus
client.on('disconnected', (reason) => {
    console.log('Koneksi terputus!', reason);
    console.log('Mencoba menyambungkan ulang...');
    client.initialize();
});

// Inisialisasi client
client.initialize();

// Format respons API standar
const jsonResponse = (success, message, data = []) => ({
    success,
    message,
    data
});

// Endpoint untuk mengirim pesan
app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    const formattedNumber = `${number}@c.us`;

    try {
        await client.sendMessage(formattedNumber, message);
        res.json(jsonResponse(true, 'Pesan terkirim'));
    } catch (error) {
        res.status(500).json(jsonResponse(false, 'Gagal mengirim pesan', { error: error.message }));
    }
});

// Endpoint untuk menampilkan QR code melalui API
app.get('/get-qr', (req, res) => {
    if (qrCodeData && qrExpiryTime && Date.now() < qrExpiryTime) {
        const timeLeft = Math.floor((qrExpiryTime - Date.now()) / 1000);
        res.json(jsonResponse(true, 'QR Code tersedia', {
            qrcode: qrCodeData,
            duration: timeLeft
        }));
    } else {
        res.json(jsonResponse(false, 'Tidak ada QR Code tersedia atau telah kadaluarsa'));
    }
});

// Endpoint untuk logout dari sesi WhatsApp
app.post('/logout', async (req, res) => {
    try {
        await client.logout();
        if (fs.existsSync(SESSION_DIR)) {
            fs.rmSync(SESSION_DIR, { recursive: true, force: true });
            console.log('Session berhasil dihapus.');
        }
        res.json(jsonResponse(true, 'Berhasil logout'));
    } catch (error) {
        res.status(500).json(jsonResponse(false, 'Gagal logout', { error: error.message }));
    }
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
