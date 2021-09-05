# Node Image
FROM node:16.7.0
WORKDIR /usr/src/app

# Install deps
RUN apt-get update
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# install nodejs packages
COPY package*.json ./
RUN npm install

COPY . .

# Expose ports 3000, 9 and start server
EXPOSE 3000

CMD ["node", "server.js"]