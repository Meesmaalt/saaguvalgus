// Google Analytics 4 (GA4) integration utility for Kirjastus Saagu Valgus

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

let isInitialized = false;
let currentGaId: string | null = null;

/**
 * Initializes Google Analytics 4 with the provided Measurement ID (G-XXXXXXXXXX)
 * or falls back to VITE_GA_MEASUREMENT_ID from environment variables.
 */
export function initGA(customId?: string) {
  if (typeof window === 'undefined') return;

  const gaId = customId?.trim() || (import.meta.env.VITE_GA_MEASUREMENT_ID as string)?.trim();
  
  if (!gaId || gaId === 'G-XXXXXXXXXX') {
    return;
  }

  if (isInitialized && currentGaId === gaId) {
    return;
  }

  currentGaId = gaId;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  // Configure script tag
  const scriptId = 'ga4-gtag-script';
  let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
  
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = scriptId;
    scriptEl.async = true;
    scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(scriptEl);
  } else {
    scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  }

  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    page_path: window.location.pathname + window.location.hash,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  isInitialized = true;
}

/**
 * Tracks a page view in GA4
 */
export function trackPageView(pagePath?: string, pageTitle?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: pagePath || window.location.pathname + window.location.hash,
    page_title: pageTitle || document.title,
    page_location: window.location.href
  });
}

/**
 * Generic event tracker
 */
export function trackEvent(
  action: string, 
  category: string, 
  label?: string, 
  value?: number, 
  customParams?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...customParams
  });
}

// Specialized event trackers for Saagu Valgus
export const analytics = {
  trackBookOrder: (bookTitle: string, quantity: number, type: 'order' | 'preorder') => {
    trackEvent('purchase_intent', 'Ecommerce', `${type}: ${bookTitle}`, quantity, {
      book_title: bookTitle,
      order_type: type,
      quantity
    });
  },

  trackPublicationDownload: (publicationTitle: string, fileName?: string) => {
    trackEvent('file_download', 'Publications', publicationTitle, 1, {
      publication_title: publicationTitle,
      file_name: fileName
    });
  },

  trackPublicationView: (publicationTitle: string) => {
    trackEvent('view_item', 'Publications', publicationTitle, 1, {
      publication_title: publicationTitle
    });
  },

  trackContactMessage: () => {
    trackEvent('generate_lead', 'Contact', 'Contact Form Submission', 1);
  },

  trackPrayerCopy: (prayerType: 'salvation' | 'lords_prayer') => {
    trackEvent('copy_prayer', 'Engagement', prayerType, 1, {
      prayer_type: prayerType
    });
  },

  trackBankDetailsCopy: (bankField: 'iban' | 'paypal' | 'email') => {
    trackEvent('copy_donation_info', 'Support', bankField, 1, {
      field: bankField
    });
  },

  trackLanguageSwitch: (newLang: 'et' | 'en') => {
    trackEvent('select_language', 'User_Preferences', newLang, 1, {
      language: newLang
    });
  },

  trackTestimonyExpand: (person: string) => {
    trackEvent('expand_testimony', 'Content', person, 1, {
      author: person
    });
  }
};
