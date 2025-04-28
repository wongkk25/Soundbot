FROM node:alpine
WORKDIR /usr/local/app

COPY package.json ./package.json
COPY src ./src

CMD ["npm", "start"]