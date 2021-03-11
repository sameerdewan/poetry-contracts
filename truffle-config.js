const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    mumbai: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://rpc-mumbai.matic.today'),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    matic: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, 'https://rpc-mainnet.matic.network'),
      network_id: 137,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
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
