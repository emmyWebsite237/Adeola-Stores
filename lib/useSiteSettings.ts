'use client';

import { useState, useEffect } from 'react';

export interface SiteSettings {
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  address: string;
  delivery_zones: string;
  announcement: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  phone: '+234 800 000 0000',
  email: 'support@ladydeestores.com',
  whatsapp: '+234 800 000 0000',
  instagram: '',
  facebook: '',
  twitter: '',
  tiktok: '',
  address: 'Ladydee Minimart Store, Lagos, Nigeria',
  delivery_zones: 'Ikeja, Lekki, Victoria Island, Surulere, Yaba, Maryland, Agege',
  announcement: 'Free delivery on orders over ₦50,000 across Lagos',
};

// Memory cache to prevent layout shift between navigation
let cachedSettings: SiteSettings | null = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(!cachedSettings);

  useEffect(() => {
    let mounted = true;

    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.settings && mounted) {
            const merged = { ...DEFAULT_SITE_SETTINGS, ...data.settings };
            cachedSettings = merged;
            setSettings(merged);
          }
        }
      } catch (err) {
        console.warn('[useSiteSettings] using default fallback:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}
