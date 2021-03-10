FROM node:14

WORKDIR /usr/src/app

EXPOSE 8545

ENV MNEMONIC=squirrel\ march\ broom\ strong\ kick\ blast\ unique\ team\ song\ song\ assist\ million
ENV INFURAKEY=https://rinkeby.infura.io/v3/df4de1f306044440bf0e4843d8ff667b
ENV NETWORK=development
ENV ENV=DEVELOPMENT

RUN npm install -g ganache-cli

CMD ["ganache-cli", "-m", "squirrel march broom strong kick blast unique team song song assist million"]

COPY . .
ADD truffle-config.js truffle.js

RUN npm install
RUN npm install -g truffle
