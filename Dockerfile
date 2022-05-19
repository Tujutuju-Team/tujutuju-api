# syntax=docker/dockerfile:1

FROM node:16-alpine3.14

WORKDIR /usr/src/app

COPY ./ /usr/src/app

RUN npm install

CMD ["node", "./src/main.js"]
