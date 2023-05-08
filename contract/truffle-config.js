const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "e00719e767404716a9d3c82c5138df53";
const mnemonic = "crazy hour humble insect bid machine amused stool liar valley trip artefact"; // Seed phrase

//Please dont use the account you use personally as this project will
//be in a public repo


module.exports = {
  networks: {
    sepolia: {
      provider: () => new HDWalletProvider(mnemonic, `https://sepolia.infura.io/v3/e00719e767404716a9d3c82c5138df53`),
      network_id: '11155111', // Goerli's network ID
      gas: 5500000,
    },
    // ... other networks
  },
  compilers: {
    solc: {
      version: "0.8.19",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  },
  // ... rest of the truffle-config.js
};
