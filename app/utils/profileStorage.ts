
'use client'

export interface SearchResult {
  name: string;
  title: string;
  color?: string;
  textColor?: string;
  icon?: string;
  handle?: string;
  stats?: {
    totalEarned?: string;
    todayPoints?: string;
    searchCount?: number;
    owned?: boolean;
  };
  points?: number;
  searchCount?: number;
  owned?: boolean;
}

// Profile Cards (original data - editable for card display)
const DEFAULT_PROFILE_CARDS: SearchResult[] = [
  {
    name: "MONAD",
    title: "Currently Testnet",
    color: "#6B46C1",
    textColor: "#E0E7FF",
    icon: "/monad_logo.ico",
    handle: "@monad_xyz",
    stats: {
      totalEarned: "$12,500",
      todayPoints: "+420",
      searchCount: 1247,
      owned: false
    }
  },
  {
    name: "BENJA",
    title: "Currently Base Chain",
    color: "#059669",
    textColor: "#D1FAE5",
    icon: "/benja.ico",
    handle: "@itsbenja",
    stats: {
      totalEarned: "$8,900",
      todayPoints: "+320",
      searchCount: 892,
      owned: false
    }
  },
  {
    name: "JAMES",
    title: "Currently Solana",
    color: "#DC2626",
    textColor: "#FEE2E2",
    icon: "/JAMES.ico",
    handle: "@jameschain",
    stats: {
      totalEarned: "$15,600",
      todayPoints: "+510",
      searchCount: 1435,
      owned: false
    }
  },
  {
    name: "EUNICE",
    title: "Currently Ethereum",
    color: "#7C2D12",
    textColor: "#FED7AA",
    icon: "/EUNICE.ico",
    handle: "@euniceeth",
    stats: {
      totalEarned: "$22,100",
      todayPoints: "+680",
      searchCount: 2156,
      owned: false
    }
  },
  {
    name: "MIKE",
    title: "Currently Polygon",
    color: "#1E40AF",
    textColor: "#DBEAFE",
    icon: "/mike.ico",
    handle: "@mikepoly",
    stats: {
      totalEarned: "$9,800",
      todayPoints: "+390",
      searchCount: 987,
      owned: false
    }
  },
  {
    name: "KEONEHON",
    title: "Currently Arbitrum",
    color: "#9333EA",
    textColor: "#F3E8FF",
    icon: "/KEONEHON.ico",
    handle: "@keonearb",
    stats: {
      totalEarned: "$18,200",
      todayPoints: "+590",
      searchCount: 1678,
      owned: false
    }
  }
];

// Search Profiles (immutable data for search/leaderboard functionality)
const DEFAULT_SEARCH_PROFILES: SearchResult[] = [
  {
    name: "MONAD",
    title: "Currently Testnet",
    color: "#6B46C1",
    textColor: "#E0E7FF",
    icon: "/monad_logo.ico",
    handle: "@monad_xyz",
    points: 1247,
    searchCount: 1247,
    owned: false
  },
  {
    name: "BENJA",
    title: "Currently Base Chain",
    color: "#059669",
    textColor: "#D1FAE5",
    icon: "/benja.ico",
    handle: "@itsbenja",
    points: 892,
    searchCount: 892,
    owned: false
  },
  {
    name: "JAMES",
    title: "Currently Solana",
    color: "#DC2626",
    textColor: "#FEE2E2",
    icon: "/JAMES.ico",
    handle: "@jameschain",
    points: 1435,
    searchCount: 1435,
    owned: false
  },
  {
    name: "EUNICE",
    title: "Currently Ethereum",
    color: "#7C2D12",
    textColor: "#FED7AA",
    icon: "/EUNICE.ico",
    handle: "@euniceeth",
    points: 2156,
    searchCount: 2156,
    owned: false
  },
  {
    name: "MIKE",
    title: "Currently Polygon",
    color: "#1E40AF",
    textColor: "#DBEAFE",
    icon: "/mike.ico",
    handle: "@mikepoly",
    points: 987,
    searchCount: 987,
    owned: false
  },
  {
    name: "KEONEHON",
    title: "Currently Arbitrum",
    color: "#9333EA",
    textColor: "#F3E8FF",
    icon: "/KEONEHON.ico",
    handle: "@keonearb",
    points: 1678,
    searchCount: 1678,
    owned: false
  }
];

// Get profile cards (mutable for card display/editing)
export function getProfileCards(): SearchResult[] {
  if (typeof window === 'undefined') return DEFAULT_PROFILE_CARDS;

  try {
    const stored = localStorage.getItem('profileCards');
    if (stored) {
      const cards = JSON.parse(stored);
      return cards.length > 0 ? cards : DEFAULT_PROFILE_CARDS;
    }
    
    // Initialize with defaults if not found
    localStorage.setItem('profileCards', JSON.stringify(DEFAULT_PROFILE_CARDS));
    return DEFAULT_PROFILE_CARDS;
  } catch (error) {
    console.warn('Error loading profile cards:', error);
    return DEFAULT_PROFILE_CARDS;
  }
}

// Save profile card data (separate from search profiles)
export function saveProfileCard(updatedProfile: SearchResult) {
  if (typeof window === 'undefined') return;

  try {
    const currentCards = getProfileCards();
    const updatedCards = currentCards.map(card => 
      card.name === updatedProfile.name ? { ...card, ...updatedProfile } : card
    );
    
    localStorage.setItem('profileCards', JSON.stringify(updatedCards));
    
    // Also update search profiles for consistency
    const searchProfiles = getSearchProfiles();
    const updatedSearchProfiles = searchProfiles.map(profile => 
      profile.name === updatedProfile.name ? {
        ...profile,
        ...updatedProfile,
        points: updatedProfile.stats?.searchCount || profile.points || 0,
        searchCount: updatedProfile.stats?.searchCount || profile.searchCount || 0
      } : profile
    );
    
    localStorage.setItem('searchProfiles', JSON.stringify(updatedSearchProfiles));
    console.log('Profile saved successfully:', updatedProfile.name);
  } catch (error) {
    console.error('Error saving profile card:', error);
  }
}

// Legacy function for backward compatibility
export function saveProfile(updatedProfile: SearchResult) {
  saveProfileCard(updatedProfile);
}

// Get search profiles (immutable for search/leaderboard)
export function getSearchProfiles(): SearchResult[] {
  if (typeof window === 'undefined') return DEFAULT_SEARCH_PROFILES;

  try {
    const stored = localStorage.getItem('searchProfiles');
    if (stored) {
      const profiles = JSON.parse(stored);
      return profiles.length > 0 ? profiles : DEFAULT_SEARCH_PROFILES;
    }
    
    // Initialize with defaults if not found
    localStorage.setItem('searchProfiles', JSON.stringify(DEFAULT_SEARCH_PROFILES));
    return DEFAULT_SEARCH_PROFILES;
  } catch (error) {
    console.warn('Error loading search profiles:', error);
    return DEFAULT_SEARCH_PROFILES;
  }
}

// Legacy function for backward compatibility
export function getProfiles(): SearchResult[] {
  return getSearchProfiles();
}

// Initialize default ownership for all profile cards
export function initializeDefaultOwnership() {
  if (typeof window === 'undefined') return;

  try {
    const profileCards = getProfileCards();
    const searchProfiles = getSearchProfiles();
    
    // Update profile cards
    const updatedCards = profileCards.map(card => ({
      ...card,
      stats: {
        ...card.stats,
        owned: card.stats?.owned ?? false
      },
      owned: card.owned ?? false
    }));
    
    // Update search profiles
    const updatedSearchProfiles = searchProfiles.map(profile => ({
      ...profile,
      owned: profile.owned ?? false
    }));
    
    localStorage.setItem('profileCards', JSON.stringify(updatedCards));
    localStorage.setItem('searchProfiles', JSON.stringify(updatedSearchProfiles));
    
    console.log('Default ownership initialized for all profiles');
  } catch (error) {
    console.error('Error initializing default ownership:', error);
  }
}

// Update search count for a specific profile
export function updateProfileSearchCount(handle: string) {
  if (typeof window === 'undefined') return;

  try {
    const profiles = getSearchProfiles();
    const updatedProfiles = profiles.map(profile => 
      profile.handle === handle ? {
        ...profile,
        searchCount: (profile.searchCount || 0) + 1,
        points: (profile.points || 0) + 1
      } : profile
    );
    
    localStorage.setItem('searchProfiles', JSON.stringify(updatedProfiles));
    
    // Also update profile cards
    const cards = getProfileCards();
    const updatedCards = cards.map(card => 
      card.handle === handle ? {
        ...card,
        stats: {
          ...card.stats,
          searchCount: (card.stats?.searchCount || 0) + 1
        }
      } : card
    );
    
    localStorage.setItem('profileCards', JSON.stringify(updatedCards));
    
    console.log(`Search count updated for ${handle}`);
  } catch (error) {
    console.error('Error updating search count:', error);
  }
}

// Get search counts for all profiles
export function getProfileSearchCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {};

  try {
    const profiles = getSearchProfiles();
    const counts: Record<string, number> = {};
    
    profiles.forEach(profile => {
      if (profile.handle) {
        counts[profile.handle] = profile.searchCount || 0;
      }
    });
    
    return counts;
  } catch (error) {
    console.error('Error getting search counts:', error);
    return {};
  }
}

// Clear all profile data
export function clearAllProfileData() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('profileCards');
    localStorage.removeItem('searchProfiles');
    localStorage.removeItem('profileSearchCounts');
    console.log('All profile data cleared');
  } catch (error) {
    console.error('Error clearing profile data:', error);
  }
}

// Reset profiles to defaults
export function resetToDefaults() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('profileCards', JSON.stringify(DEFAULT_PROFILE_CARDS));
    localStorage.setItem('searchProfiles', JSON.stringify(DEFAULT_SEARCH_PROFILES));
    localStorage.removeItem('profileSearchCounts');
    console.log('Profiles reset to defaults');
  } catch (error) {
    console.error('Error resetting to defaults:', error);
  }
}

// Check all storage data
export function checkStorageStatus() {
  if (typeof window === 'undefined') return;

  console.log('=== PROFILE STORAGE STATUS ===');
  console.log('Profile Cards:', getProfileCards());
  console.log('Search Profiles:', getSearchProfiles());
  console.log('Search Counts:', getProfileSearchCounts());
  console.log('==============================');
}
