
'use client'

import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useEffect, useState, useCallback, useRef } from 'react'

export default function WalletConnection() {
  const { open } = useAppKit()
  const { address, isConnected, caipAddress } = useAppKitAccount()
  const { caipNetwork, caipNetworkId } = useAppKitNetwork()
  const [mounted, setMounted] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const preloadAttempted = useRef(false)
  const connectionCache = useRef<any>(null)

  // Aggressive preloading with caching
  const preloadModal = useCallback(() => {
    if (preloadAttempted.current) return
    preloadAttempted.current = true

    try {
      // Cache connection state
      if (isConnected && address) {
        connectionCache.current = { address, caipNetwork }
      }

      // Create modal element for preloading
      const modal = document.createElement('w3m-modal')
      modal.setAttribute('data-preloaded', 'true')
      if (!document.querySelector('w3m-modal')) {
        (modal as any).style.display = 'none'
        document.body.appendChild(modal)
      }

      // Preload modal resources
      const preloadTasks = [
        // Create modal element early
        () => {
          const modal = document.querySelector('w3m-modal') || document.createElement('w3m-modal')
          modal.setAttribute('data-preloaded', 'true')
          if (!document.querySelector('w3m-modal')) {
            (modal as HTMLElement).style.display = 'none'
            document.body.appendChild(modal)
          }
        },
        // Preload wallet providers
        () => {
          if (window.ethereum && typeof window.ethereum.request === 'function') {
            window.ethereum.request({ method: 'eth_accounts' }).catch(() => {})
          }
        },
        // Warm up network detection
        () => {
          if (window.ethereum) {
            try {
              // Check if ethereum provider is connected
              if (typeof window.ethereum.isConnected === 'function') {
                window.ethereum.isConnected()
              }
            } catch {}
          }
        }
      ]

      // Execute preload tasks with minimal delay
      preloadTasks.forEach((task, index) => {
        setTimeout(task, index * 10)
      })
    } catch (error) {
      // Silent fail for better UX
    }
  }, [isConnected, address, caipNetwork])

  // Immediate mounting and preloading
  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      // Preload modal
      preloadModal()
      
      // Warm up wallet detection
      setTimeout(() => {
        try {
          // Check for ethereum provider
          if ((window as any).ethereum) {
            (window as any).ethereum.request?.({ method: 'eth_accounts' }).catch(() => {})
          }
        } catch {}
        
        // Warm up network detection
        try {
          if ((window as any).web3) {
            (window as any).web3.currentProvider?.isConnected?.()
          }
        } catch {}
      }, 100)
    }
    
    setIsReady(true)

    // Additional preloads for reliability
    const timeouts = [50, 100, 200].map(delay => 
      setTimeout(preloadModal, delay)
    )

    return () => timeouts.forEach(clearTimeout)
  }, [preloadModal])

  // Optimized connection handler with immediate feedback
  const handleConnect = useCallback(() => {
    if (isOpening) return
    
    // Immediate visual feedback
    setIsOpening(true)
    
    // Use cached data if available for faster display
    if (connectionCache.current && !isConnected) {
      // Show cached state briefly while connecting
      setTimeout(() => setIsOpening(false), 100)
    }
    
    try {
      // Open modal immediately without delay
      open()
    } catch (error) {
      console.warn('Connection failed:', error)
    } finally {
      // Quick reset for immediate re-trigger capability
      setTimeout(() => setIsOpening(false), 150)
    }
  }, [open, isOpening, isConnected])

  // Optimized loading state with skeleton
  if (!mounted || !isReady) {
    return (
      <div className="wallet-connection">
        <div className="wallet-connect-btn loading shimmer" style={{ 
          background: 'linear-gradient(90deg, rgba(102, 126, 234, 0.1) 25%, rgba(102, 126, 234, 0.3) 50%, rgba(102, 126, 234, 0.1) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          minWidth: '140px',
          height: '48px'
        }}>
          <span className="wallet-btn-text" style={{ opacity: 0.7 }}>Loading...</span>
          <div className="wallet-btn-glow"></div>
        </div>
      </div>
    )
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <div className="wallet-connection">
      {isConnected && address ? (
        <div className="wallet-info-container">
          <div className="wallet-details">
            <div className="wallet-address-display">
              <span className="wallet-address-label">Address:</span>
              <span className="wallet-address">{formatAddress(address)}</span>
            </div>
            {caipNetwork && (
              <div className="wallet-network-display">
                <span className="wallet-network-label">Network:</span>
                <span className="wallet-network">{caipNetwork.name}</span>
              </div>
            )}
          </div>
          <button 
            onClick={handleConnect}
            className="wallet-connect-btn connected"
            style={{ transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <span className="wallet-btn-text">Manage Wallet</span>
            <div className="wallet-btn-glow"></div>
          </button>
        </div>
      ) : (
        <button 
          onClick={handleConnect}
          className={`wallet-connect-btn ${isOpening ? 'opening' : ''}`}
          disabled={isOpening}
          style={{ 
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: isOpening ? 'wait' : 'pointer'
          }}
        >
          <span className="wallet-btn-text">
            {isOpening ? 'Connecting...' : 'Connect Wallet'}
          </span>
          <div className="wallet-btn-glow"></div>
        </button>
      )}
    </div>
  )
}
