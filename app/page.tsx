'use client';
import { useState, useEffect } from 'react';
import ProfileCard from './ProfileCard';
import SearchAndLeaderboard from './SearchAndLeaderboard';
import WalletConnection from './components/WalletConnection';
import { useAppKitAccount } from '@reown/appkit/react';

import { saveProfile } from './utils/profileStorage';
import { SecurityManager } from './utils/security';
import { getProfiles, getProfileSearchCounts, updateProfileSearchCount, initializeDefaultOwnership, checkStorageStatus } from './utils/profileStorage';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, address } = useAppKitAccount();
  const [profileData, setProfileData] = useState({
    name: "MONAD",
    title: "Currently Testnet",
    handle: "monad",
    status: "Online",
    avatarUrl: "/monad_logo.ico"
  });

  // Scroll behavior for header
  useEffect(() => {
    let lastScrollY = 0;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (direction !== (document.body.classList.contains('scrolling-down') ? 'down' : 'up')) {
        document.body.classList.toggle('scrolling-down', direction === 'down');
        document.body.classList.toggle('scrolling-up', direction === 'up');
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    const onScroll = () => requestTick();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Clear all saved data on mount - run only once
  useEffect(() => {
    const hasCleared = sessionStorage.getItem('dataCleared');
    if (!hasCleared) {
      localStorage.removeItem('profileData');
      localStorage.removeItem('profileSearchCounts');
      localStorage.removeItem('userProfiles');
      localStorage.removeItem('savedAvatars');
      localStorage.removeItem('profileSettings');
      sessionStorage.setItem('dataCleared', 'true');
    }
  }, []);

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize security
    if (typeof window !== 'undefined') {
      SecurityManager.getInstance();

      // Load saved profile data
      try {
        const savedProfileData = localStorage.getItem('currentProfileData');
        if (savedProfileData) {
          const parsed = JSON.parse(savedProfileData);
          setProfileData(parsed);
        }
      } catch (error) {
        console.warn('Failed to load saved profile data:', error);
      }
    }
  }, []);

  const handleProfileSelect = (profile: any) => {
    setProfileData({
      name: profile.name,
      title: profile.title,
      handle: profile.handle,
      status: profile.status || 'Online',
      avatarUrl: profile.avatarUrl
    });
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    const newProfileData = {
      name: updatedProfile.name,
      title: updatedProfile.title,
      handle: updatedProfile.handle,
      status: updatedProfile.status || "Online",
      avatarUrl: updatedProfile.avatarUrl
    };

    setProfileData(newProfileData);

    try {
      // Get existing profile cards to preserve search count
      const profileCards = JSON.parse(localStorage.getItem('profileCards') || '[]');
      const existingProfile = profileCards.find((p: any) => p.handle === updatedProfile.handle);

      // Import the profile card save function
      const { saveProfileCard } = require('./utils/profileStorage');
      
      saveProfileCard({
        name: updatedProfile.name,
        title: updatedProfile.title,
        handle: updatedProfile.handle,
        avatarUrl: updatedProfile.avatarUrl,
        status: updatedProfile.status || "Online",
        searchCount: existingProfile ? existingProfile.searchCount : 0
      });

      // Also save the current profile data separately
      localStorage.setItem('currentProfileData', JSON.stringify(newProfileData));
    } catch (error) {
      console.warn('Failed to save profile:', error);
    }
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  // Wallet Gate Component
  if (!isConnected) {
    return (
      <main style={{ 
        background: '#000000',
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        {/* Holographic Background Grid */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)
          `,
          animation: 'holographicShift 8s ease-in-out infinite',
          zIndex: 1
        }} />

        {/* Animated Grid Lines */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite',
          zIndex: 2
        }} />

        {/* Large Background Monad Logo with Holographic Effect */}
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          opacity: 0.1,
          pointerEvents: 'none'
        }}>
          <img 
            src="/monad_logo.ico" 
            alt="Background Monad Logo" 
            style={{
              width: '80vmin',
              height: '80vmin',
              objectFit: 'contain',
              filter: 'blur(2px) hue-rotate(0deg)',
              animation: 'holographicGlow 6s ease-in-out infinite'
            }}
          />
        </div>

        {/* Wallet Gate Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Floating Monad Logo */}
          <div style={{ 
            zIndex: 50,
            pointerEvents: 'none',
            animation: 'float 6s ease-in-out infinite, holographicGlow 4s ease-in-out infinite alternate',
            marginBottom: '30px'
          }}>
            <img 
              src="/monad_logo.ico" 
              alt="Monad Logo" 
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'contain',
                transition: 'transform 0.3s ease',
                filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.6))'
              }}
            />
          </div>

          {/* Main Heading */}
          <h1 style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease-in-out infinite',
            textShadow: '0 0 30px rgba(102, 126, 234, 0.5)',
            lineHeight: '1.2',
            margin: 0,
            padding: 0,
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            letterSpacing: '0.1em'
          }}>
            MONAD PROFILE CARD
          </h1>

          {/* Access Gate Message */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '20px',
            padding: '30px',
            backdropFilter: 'blur(15px)',
            marginBottom: '40px',
            maxWidth: '500px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Holographic Shimmer Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              animation: 'shimmer 3s infinite'
            }} />

            <h2 style={{
              color: '#ffffff',
              fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
              marginBottom: '15px',
              fontWeight: '600'
            }}>
              🔐 Access Restricted
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
              lineHeight: '1.6',
              margin: 0
            }}>
              Connect your wallet to access the Monad Profile Card platform and explore the holographic profile ecosystem.
            </p>
          </div>

          {/* Enhanced Wallet Connection */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.4)',
            borderRadius: '25px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.2)'
          }}>
            <WalletConnection />
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '50px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              padding: '8px 16px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                Build by{' '}
                <a
                  href="https://x.com/_fazalurrehman0"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  HUNTER
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ 
            background: '#000000',
            width: '100%',
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '40px 20px',
            boxSizing: 'border-box'
          }}>

      {/* Large Background Monad Logo */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        opacity: 0.1,
        pointerEvents: 'none'
      }}>
        <img 
          src="/monad_logo.ico" 
          alt="Background Monad Logo" 
          style={{
            width: '80vmin',
            height: '80vmin',
            objectFit: 'contain',
            filter: 'blur(2px)'
          }}
        />
      </div>

      {/* Header with Search and Wallet */}
      <div className="header-container" style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        pointerEvents: 'auto'
      }}>
        <SearchAndLeaderboard 
          onProfileSelect={handleProfileSelect} 
          connectedWallet={address || ''}
        />
        <WalletConnection />
      </div>

      {/* Floating Monad Logo - Centered above content */}
      <div style={{ 
        zIndex: 50,
        pointerEvents: 'none',
        animation: 'float 6s ease-in-out infinite, glow 4s ease-in-out infinite alternate',
        marginBottom: '20px'
      }}>
        <img 
          src="/monad_logo.ico" 
          alt="Monad Logo" 
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain',
            transition: 'transform 0.3s ease'
          }}
        />
      </div>

      {/* Main Heading - Centered */}
      <div style={{
        textAlign: 'center',
        zIndex: 49,
        width: '100%',
        maxWidth: '900px',
        marginBottom: '20px'
      }}>
        <h1 style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradientShift 3s ease-in-out infinite',
          textShadow: '0 0 30px rgba(102, 126, 234, 0.5)',
          lineHeight: '1.2',
          margin: 0,
          padding: 0,
          fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
          fontWeight: 'bold',
          marginBottom: '0.8rem',
          letterSpacing: '0.1em'
        }}>
          MONAD PROFILE CARD
        </h1>
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0,
          lineHeight: '1.4',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Create and customize your unique Monad profile card with holographic effects
        </p>
      </div>

      {/* Footer - Centered below headings */}
      <div style={{
        textAlign: 'center',
        zIndex: 49,
        width: '100%',
        maxWidth: '900px',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '25px',
          padding: '8px 16px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            Build by{' '}
            <a
              href="https://x.com/_fazalurrehman0"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1.05)';
                target.style.textShadow = '0 0 10px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLElement;
                target.style.transform = 'scale(1)';
                target.style.textShadow = 'none';
              }}
            >
              HUNTER
            </a>
          </p>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        zIndex: 10
      }}>
        <ProfileCard
          avatarUrl={profileData.avatarUrl}
          name={profileData.name}
          title={profileData.title}
          handle={profileData.handle}
          status={profileData.status}
          onProfileUpdate={handleProfileUpdate}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onContactClick={() => {
            window.open(`https://x.com/${profileData.handle}`, '_blank');
          }}
          connectedWallet={address || ''}
        />
      </div>
    </main>
  );
}
