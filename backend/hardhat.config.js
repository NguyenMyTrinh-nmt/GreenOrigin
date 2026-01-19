require('dotenv').config();
require('@nomicfoundation/hardhat-toolbox');

const DEFAULT_RPC = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || process.env.BLOCKCHAIN_PRIVATE_KEY || '';

module.exports = {
  solidity: '0.8.20',
  networks: {
    localhost: {
      url: DEFAULT_RPC,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || '',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    }
  }
};
