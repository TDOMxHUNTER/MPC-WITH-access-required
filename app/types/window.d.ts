
interface Window {
  ethereum?: {
    request?: (args: { method: string; params?: any[] }) => Promise<any>;
    isMetaMask?: boolean;
    selectedAddress?: string;
  };
  web3?: {
    currentProvider?: {
      isConnected?: () => boolean;
      selectedAddress?: string;
    };
  };
}

declare global {
  interface Window {
    ethereum?: {
      request?: (args: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask?: boolean;
      selectedAddress?: string;
    };
    web3?: {
      currentProvider?: {
        isConnected?: () => boolean;
        selectedAddress?: string;
      };
    };
  }
}

export {};
