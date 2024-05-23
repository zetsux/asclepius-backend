FROM node:21.7

WORKDIR /app

COPY package*.json .
RUN npm install
COPY . .
CMD node ./src/server/server.js