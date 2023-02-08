FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 2003

ENV NODE_ENV=development

CMD ["node", "server.js"]