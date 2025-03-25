FROM node:20-slim

# Install library yang dibutuhkan oleh Puppeteer/Chrome
RUN apt-get update && apt-get install -y \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Salin file package.json dan yarn.lock, lalu install dependency
COPY package.json yarn.lock ./
RUN yarn install

# Salin seluruh source code dan file .env
COPY . .
COPY .env .env

# Ekspos port sesuai yang kamu gunakan (misalnya 3001)
EXPOSE 3001

# Jalankan perintah install ulang (opsional) dan start aplikasi
CMD ["sh", "-c", "yarn install && yarn start"]
