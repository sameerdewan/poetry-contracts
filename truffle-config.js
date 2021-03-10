const HDWalletProvider = require('@truffle/hdwallet-provider');

const {
  MNEMONIC,
  INFURAKEY,
} = process.env;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    rinkeby: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURAKEY),
      network_id: 4,
      gas: 8500000,
      gasPrice: 10000000000,
      type: 'quorum',
    },
    matic: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: '^0.6.0',
    },
  },
  mocha: {
    enableTimeouts: false,
  },
};
