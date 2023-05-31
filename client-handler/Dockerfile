FROM node:19.6.0-alpine3.17


RUN apk update && apk add bash

RUN node --version
RUN npm --version

RUN mkdir /etc/chaindirect

COPY fullchain.pem /etc/chaindirect
COPY privkey.pem /etc/chaindirect

COPY public /chaindirect/dist/public

WORKDIR /chaindirect

COPY . .

# RUN npm install typescript -g
# RUN npm install -D ts-node-dev
RUN npm install
RUN npm run build
# RUN npm run dev
RUN rm *.pem
RUN rm -rf src
CMD [ "node", "dist/index.js" ]
# CMD [ "npm", "run", "dev" ]

# docker build -t chaindirect/chain-direct:version .
# docker run -d --name client --network=host chaindirect/chain-direct:version 