# Node Image
FROM node
WORKDIR /usr/src/app

# Install deps
RUN apt update && apt upgrade -y && apt install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

# Copy files over and make directories
COPY . .
RUN mkdir -p /usr/src/app/static/images && mkdir -p /usr/src/app/cache && mkdir -p /usr/src/app/config

# install nodejs packages
COPY package*.json ./
RUN npm install

# Expose ports 3000
EXPOSE 3000

CMD ["node", "server.js"]