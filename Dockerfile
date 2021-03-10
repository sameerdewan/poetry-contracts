FROM node:14

WORKDIR /usr/src/app

ARG MNEMONIC
ARG NETWORK

RUN npm install -g ganache-cli
RUN npm install -g truffle

CMD ["ganache-cli", "-m", ${MNEMONIC}}, "-h", "0.0.0.0"]

RUN truffle migrate --reset --network ${NETWORK}
