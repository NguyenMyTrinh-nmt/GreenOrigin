import { ethers } from 'ethers';
import api from './api';

// Cấu hình mạng Cronos
const CRONOS_TESTNET = {
  chainId: '0x152', // 338 in hex
  chainName: 'Cronos Testnet',
  nativeCurrency: {
    name: 'TCRO',
    symbol: 'TCRO',
    decimals: 18
  },
  rpcUrls: ['https://evm-t3.cronos.org'],
  blockExplorerUrls: ['https://cronos.org/explorer/testnet3']
};

const CRONOS_MAINNET = {
  chainId: '0x19', // 25 in hex
  chainName: 'Cronos Mainnet',
  nativeCurrency: {
    name: 'CRO',
    symbol: 'CRO',
    decimals: 18
  },
  rpcUrls: ['https://evm.cronos.org'],
  blockExplorerUrls: ['https://cronos.org/explorer']
};

// Sử dụng testnet mặc định
const CRONOS_NETWORK = CRONOS_TESTNET;

export const switchToCronosNetwork = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Vui lòng cài đặt MetaMask!');
  }

  try {
    // Thử chuyển sang mạng Cronos
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CRONOS_NETWORK.chainId }],
    });
  } catch (switchError) {
    // Nếu mạng chưa được thêm, thêm mạng mới
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [CRONOS_NETWORK],
        });
      } catch (addError) {
        throw new Error('Không thể thêm mạng Cronos: ' + addError.message);
      }
    } else {
      throw new Error('Không thể chuyển sang mạng Cronos: ' + switchError.message);
    }
  }
};

export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Vui lòng cài đặt MetaMask!');
  }

  try {
    // Chuyển sang mạng Cronos trước khi kết nối
    await switchToCronosNetwork();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // Kiểm tra xem đã kết nối đúng mạng chưa
    const network = await provider.getNetwork();
    const expectedChainId = parseInt(CRONOS_NETWORK.chainId, 16);
    
    if (Number(network.chainId) !== expectedChainId) {
      throw new Error(`Vui lòng chuyển sang mạng ${CRONOS_NETWORK.chainName}`);
    }

    return { provider, signer, address };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const loginWithMetaMask = async (signer, walletAddress) => {
  try {
    // Bước 1: Lấy nonce từ server
    const nonceResponse = await api.post('/web3auth/request-nonce', {
      walletAddress,
    });

    const { message } = nonceResponse.data.data;

    // Bước 2: Ký message bằng MetaMask
    const signature = await signer.signMessage(message);

    // Bước 3: Verify và lấy token
    const verifyResponse = await api.post('/web3auth/verify', {
      walletAddress,
      signature,
      message,
    });

    if (verifyResponse.data.success) {
      // Lưu token và wallet address
      localStorage.setItem('jwtToken', verifyResponse.data.data.token);
      localStorage.setItem('walletAddress', verifyResponse.data.data.walletAddress);
      
      return verifyResponse.data.data;
    } else {
      throw new Error(verifyResponse.data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

export const getWalletAddress = () => {
  return localStorage.getItem('walletAddress');
};

export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('walletAddress');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
