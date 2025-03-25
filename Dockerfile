FROM node:20

WORKDIR /app

COPY package*.json ./
RUN corepack enable

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "yarn install && yarn start"]
