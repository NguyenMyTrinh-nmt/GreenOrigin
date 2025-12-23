import { ethers } from 'ethers';
import api from './api';

export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Vui lòng cài đặt MetaMask!');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

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
