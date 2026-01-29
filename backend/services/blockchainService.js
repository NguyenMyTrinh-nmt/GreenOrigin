const path = require('path');
const { ethers } = require('ethers');
const contractArtifact = require('../blockchain/abi/AgroTraceability.json');
const abi = contractArtifact.abi;

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

// Thêm sản phẩm mới vào blockchain (dùng cho smart contract AgroTraceability)
async function addProductToChain({ productId, name, farm }) {
  const contract = getContract();
  const tx = await contract.addProduct(productId, name, farm);
  const receipt = await tx.wait();

  return {
    transactionHash: tx.hash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : undefined
  };
}

// Thêm bước truy vết cho sản phẩm
async function addTraceToChain({ productId, action, location }) {
  const contract = getContract();
  const tx = await contract.addTrace(productId, action, location);
  const receipt = await tx.wait();

  return {
    transactionHash: tx.hash,
    blockNumber: receipt.blockNumber,
    from: receipt.from,
    gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : undefined
  };
}

// Lấy thông tin sản phẩm từ blockchain
async function getProductFromChain(productId) {
  const contract = getContract();
  const result = await contract.getProduct(productId);
  
  return {
    productId: result[0],
    name: result[1],
    farm: result[2],
    createdAt: Number(result[3]),
    traceCount: Number(result[4])
  };
}

// Lấy chi tiết một bước truy vết
async function getTraceFromChain(productId, index) {
  const contract = getContract();
  const result = await contract.getTrace(productId, index);
  
  return {
    action: result[0],
    location: result[1],
    timestamp: Number(result[2]),
    actor: result[3]
  };
}

// Lấy tất cả các bước truy vết của một sản phẩm
async function getAllTracesFromChain(productId) {
  const contract = getContract();
  const productInfo = await contract.getProduct(productId);
  const traceCount = Number(productInfo[4]);
  
  const traces = [];
  for (let i = 0; i < traceCount; i++) {
    const trace = await getTraceFromChain(productId, i);
    traces.push({ ...trace, index: i });
  }
  
  return traces;
}

// Kiểm tra xem sản phẩm có tồn tại trên blockchain không
async function isProductOnBlockchain(productId) {
  try {
    const contract = getContract();
    const result = await contract.getProduct(productId);
    // Nếu productId trả về rỗng hoặc "0" thì sản phẩm không tồn tại
    return result[0] && result[0] !== "" && result[0] !== "0";
  } catch (error) {
    // Nếu có lỗi (revert) thì sản phẩm không tồn tại
    return false;
  }
}

module.exports = {
  createBatchOnChain,
  addProductToChain,
  addTraceToChain,
  getProductFromChain,
  getTraceFromChain,
  getAllTracesFromChain,
  isProductOnBlockchain
};
