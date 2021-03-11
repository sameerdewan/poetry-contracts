FROM node:14

WORKDIR /usr/src/app

EXPOSE 8545

RUN npm install -g ganache-cli

CMD ["ganache-cli", "-m", "squirrel march broom strong kick blast unique team song song assist million"]

COPY . .
ADD truffle-config.js truffle.js

RUN npm install
RUN npm install -g truffle
