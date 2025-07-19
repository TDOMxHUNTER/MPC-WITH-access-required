
import { Chain } from '../types/wallet';

export const monadTestnet: Chain & {
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  testnet: boolean;
} = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://testnet.monadexplorer.com/',
    },
  },
  testnet: true,
};

export const supportedChains = [monadTestnet];
