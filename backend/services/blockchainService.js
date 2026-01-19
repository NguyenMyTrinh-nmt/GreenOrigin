const path = require('path');
const { ethers } = require('ethers');
const abi = require('../blockchain/abi/GreenOriginTraceability.json');

let contractInstance;

function getContract() {
  if (contractInstance) {
    return contractInstance;
  }

  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!privateKey) {
    throw new Error('BLOCKCHAIN_PRIVATE_KEY is not configured');
  }

  if (!contractAddress) {
    throw new Error('CONTRACT_ADDRESS is not configured');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  contractInstance = new ethers.Contract(contractAddress, abi, wallet);
  return contractInstance;
}

async function createBatchOnChain({ batchId, growerId, productName, harvestDate }) {
  const contract = getContract();
  const tx = await contract.createBatch(batchId, growerId, productName, harvestDate);
  const receipt = await tx.wait();

  return {
    transactionHash: tx.hash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : undefined
  };
}

module.exports = {
  createBatchOnChain
};
