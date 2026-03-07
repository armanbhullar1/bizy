import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { saveBusinessProfile, loadBusinessProfile, clearBusinessProfile, isOnboardingComplete } from '@/lib/storage';
import type { BusinessProfile } from '@/types';

export function useBusinessProfile() {
  const { user, isLoading: userLoading } = useUser();
  const [businessProfile, setBusinessProfileState] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile from storage on mount
  useEffect(() => {
    if (userLoading) return;
    
    try {
      const stored = loadBusinessProfile();
      // If we have a stored profile, load it
      // This is more lenient - we trust the localStorage data
      if (stored) {
        // If user is logged in, update the uid to current user's id
        if (user?.sub && stored.uid !== user.sub) {
          stored.uid = user.sub;
          if (user.email) {
            stored.email = user.email;
          }
          saveBusinessProfile(stored);
        }
        setBusinessProfileState(stored);
      }
    } catch (e) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user, userLoading]);

  // Save profile to storage
  const setBusinessProfile = useCallback((profile: BusinessProfile) => {
    setBusinessProfileState(profile);
    saveBusinessProfile(profile);
  }, []);

  // Clear profile from storage
  const clearProfile = useCallback(() => {
    setBusinessProfileState(null);
    clearBusinessProfile();
  }, []);

  // Check if onboarding is needed
  const needsOnboarding = !loading && user && !businessProfile;

  return {
    businessProfile,
    loading: loading || userLoading,
    error,
    setBusinessProfile,
    clearProfile,
    needsOnboarding,
    isOnboardingComplete: isOnboardingComplete(),
  };
}
