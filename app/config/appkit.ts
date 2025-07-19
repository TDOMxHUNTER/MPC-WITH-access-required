import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { monadTestnet } from './chains'

// Get project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '2a3cb8da4f7f897a2306f192152dfa98'

// Create Wagmi adapter with only Monad testnet
const wagmiAdapter = new WagmiAdapter({
  networks: [monadTestnet],
  projectId,
  ssr: true
})

// Create modal with optimized settings for speed
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks: [monadTestnet],
  projectId,
  metadata: {
    name: 'Profile Card DApp',
    description: 'Create and share your Web3 profile card',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
  features: {
    analytics: false, // Disable for faster loading
    socials: ['x'], // Reduce to essential socials only
    email: false, // Disable for faster connection
  },
  allowUnsupportedChain: true,
  allWallets: 'HIDE', // Show only popular wallets for faster loading
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
  // Performance optimizations
  themeMode: 'dark',
  themeVariables: {
    '--w3m-z-index': 2000
  }
})

export { wagmiAdapter }