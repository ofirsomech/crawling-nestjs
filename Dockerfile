FROM node:18.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

RUN apk add --no-cache chromium chromium-chromedriver
COPY . .

EXPOSE 8081

CMD ["npm", "run", "start:prod"]
