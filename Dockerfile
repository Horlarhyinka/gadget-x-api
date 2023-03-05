FROM node:16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

EXPOSE 2003

COPY . .

CMD ["node", "server.js"]