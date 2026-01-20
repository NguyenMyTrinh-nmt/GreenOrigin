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
    cronos_testnet: {
      url: process.env.CRONOS_RPC_URL || 'https://evm-t3.cronos.org',
      chainId: 338,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    },
    cronos_mainnet: {
      url: process.env.CRONOS_RPC_URL || 'https://evm.cronos.org',
      chainId: 25,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : undefined,
    }
  }
};
