FROM node:7.10.0

RUN mkdir /koa-chat

COPY package.json /koa-chat

WORKDIR /koa-chat

RUN npm install

COPY . /koa-chat

EXPOSE 3000

CMD ["node", "index.js"]
