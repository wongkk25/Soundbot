FROM node:23
WORKDIR /usr/local/app

RUN apt-get update
RUN apt-get install ffmpeg -y

COPY package.json ./package.json
COPY src ./src
RUN npm install

CMD ["npm", "start"]