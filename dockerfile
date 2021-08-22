# Slim NodeJS image base
FROM node:16.5.0-slim
WORKDIR /usr/src/app

# install nodejs packages
COPY package*.json ./
RUN npm install

COPY . .

# Expose ports 3000, 9 and start server
EXPOSE 3000

CMD ["node", "server.js"]