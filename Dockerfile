FROM node:alpine
WORKDIR /usr/local/app

RUN apk add --no-cache ffmpeg python3

COPY package.json ./package.json
COPY src ./src
RUN npm install

CMD ["npm", "start"]