FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
COPY .env .env

EXPOSE 3001

CMD ["sh", "-c", "yarn install && yarn start"]
