require('dotenv').config();
const { ethers } = require('ethers');
const contractArtifact = require('./blockchain/abi/AgroTraceability.json');
const abi = contractArtifact.abi;

async function testBlockchainConnection() {
  console.log('🔍 Testing Blockchain Connection...\n');

  const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  console.log('📌 RPC URL:', rpcUrl);
  console.log('📌 Contract Address:', contractAddress);
  console.log('📌 Private Key:', privateKey ? `${privateKey.substring(0, 10)}...` : 'NOT SET');
  console.log('');

  try {
    // 1. Kết nối provider
    console.log('1️⃣ Connecting to RPC...');
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    console.log('✅ Connected to network:', network.name, '(Chain ID:', network.chainId.toString(), ')');
    console.log('');

    // 2. Kiểm tra wallet
    console.log('2️⃣ Checking wallet balance...');
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = await wallet.getAddress();
    const balance = await provider.getBalance(address);
    console.log('✅ Wallet Address:', address);
    console.log('✅ Balance:', ethers.formatEther(balance), 'ETH');
    console.log('');

    // 3. Kiểm tra contract
    console.log('3️⃣ Checking contract...');
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    // Kiểm tra xem contract có code không
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
      console.log('❌ No contract code found at address:', contractAddress);
      console.log('⚠️  Contract might not be deployed or address is wrong');
    } else {
      console.log('✅ Contract found at:', contractAddress);
      console.log('✅ Contract code size:', code.length, 'bytes');
    }
    console.log('');

    // 4. Test thêm sản phẩm
    console.log('4️⃣ Testing addProduct...');
    const testProductId = `TEST_${Date.now()}`;
    console.log('📦 Adding test product:', testProductId);
    
    const tx = await contract.addProduct(testProductId, 'Test Product', 'Test Farm');
    console.log('⏳ Transaction sent:', tx.hash);
    
    const receipt = await tx.wait();
    console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
    console.log('✅ Gas used:', receipt.gasUsed.toString());
    console.log('');

    console.log('🎉 All tests passed! Blockchain is working correctly.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.info) {
      console.error('Error info:', error.info);
    }
  }
}

testBlockchainConnection();
