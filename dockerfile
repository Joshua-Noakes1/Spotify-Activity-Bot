# Node Image
FROM node:16.7.0
WORKDIR /usr/src/app

# install nodejs packages
COPY package*.json ./
RUN npm install

COPY . .

# Expose ports 3000, 9 and start server
EXPOSE 3000

CMD ["node", "server.js"]