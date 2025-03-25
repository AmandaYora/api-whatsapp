FROM node:20

WORKDIR /app

COPY package*.json ./

# Enable corepack & install yarn dependencies
RUN corepack enable && yarn install

# Salin semua file project
COPY . .

# Pastikan file start ada di package.json -> "start": "node app.js" (atau file lain)
EXPOSE 3000

# Gunakan yarn start
CMD ["yarn", "start"]
