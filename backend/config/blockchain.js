const { ethers } = require('ethers');

// Khởi tạo provider để kết nối với blockchain
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

// Wallet cho server (dùng để gọi smart contract)
let serverWallet = null;
if (process.env.SERVER_PRIVATE_KEY) {
  serverWallet = new ethers.Wallet(process.env.SERVER_PRIVATE_KEY, provider);
}

// ABI của Smart Contract (cập nhật sau khi deploy contract)
// Đây là ABI mẫu, bạn cần thay thế bằng ABI thực tế của contract
const contractABI = [
  "function addProduct(string memory productId, string memory name, string memory origin) public returns (bool)",
  "function getProduct(string memory productId) public view returns (string memory, string memory, string memory, address, uint256)",
  "function addTraceRecord(string memory productId, string memory stage, string memory location, string memory description) public returns (bool)",
  "function getTraceRecords(string memory productId) public view returns (tuple(string stage, string location, string description, address recorder, uint256 timestamp)[])"
];

// Khởi tạo contract instance
let contract = null;
if (process.env.CONTRACT_ADDRESS && serverWallet) {
  contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    contractABI,
    serverWallet
  );
}

module.exports = {
  provider,
  serverWallet,
  contract,
  contractABI
};
