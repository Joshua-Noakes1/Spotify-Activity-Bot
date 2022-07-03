# Node Image
FROM node:alpine
WORKDIR /usr/src/app

# Install deps
RUN apk add --no-cache \
    curl \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

# Copy files over and make directories
COPY . .

# install nodejs packages
COPY package*.json ./
RUN npm install --omit=dev --no-progress
RUN npm prune --production

# Expose ports 3000
EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=3s \
    CMD curl --silent --fail http://localhost:3000/ping || exit 1

CMD ["node", "app.js"]