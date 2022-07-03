# Node Image
FROM node:alpine
WORKDIR /usr/src/app

# Install deps
# RUN apt update && apt upgrade -y && apt install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN apk add --no-cache \
    curl \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
# RUN apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig


# Copy files over and make directories
COPY . .

# install nodejs packages
COPY package*.json ./
RUN npm install --omit=dev --no-progress
RUN npm prune --production
RUN apk del --purge --no-cache \
    build-base \
    g++ \ 
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

# Expose ports 3000
EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=3s \
    CMD curl --silent --fail http://localhost:3000/ping || exit 1

CMD ["node", "app.js"]