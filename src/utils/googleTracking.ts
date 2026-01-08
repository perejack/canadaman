// Google Ads and Analytics tracking utilities

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: any
    ) => void;
    dataLayer?: any[];
  }
}

// Google Ads Account IDs
export const GOOGLE_ADS_ACCOUNTS = [
  'AW-17581166310',
  'AW-17628890920',
  'AW-17620741802'
];

interface ConversionData {
  transactionId: string;
  value: number;
  currency?: string;
  itemName?: string;
  itemId?: string;
}

/**
 * Track a successful payment conversion in Google Ads
 */
export const trackPaymentConversion = (data: ConversionData) => {
  if (typeof window === 'undefined' || !window.gtag) {
    console.warn('Google gtag not available');
    return;
  }

  try {
    // Track conversion for all Google Ads accounts
    GOOGLE_ADS_ACCOUNTS.forEach(accountId => {
      window.gtag!('event', 'conversion', {
        'send_to': `${accountId}/conversion`,
        'value': data.value,
        'currency': data.currency || 'KES',
        'transaction_id': data.transactionId
      });
    });

    // Also track as a purchase event for Google Analytics 4
    window.gtag('event', 'purchase', {
      'transaction_id': data.transactionId,
      'value': data.value,
      'currency': data.currency || 'KES',
      'items': data.itemName ? [{
        'item_id': data.itemId || 'upgrade',
        'item_name': data.itemName,
        'price': data.value,
        'quantity': 1
      }] : []
    });

    console.log('Conversion tracked successfully for all accounts:', {
      accounts: GOOGLE_ADS_ACCOUNTS,
      transactionId: data.transactionId,
      value: data.value,
      currency: data.currency || 'KES'
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
};

/**
 * Track page view
 */
export const trackPageView = (pagePath?: string) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  // Track page view for all Google Ads accounts
  GOOGLE_ADS_ACCOUNTS.forEach(accountId => {
    window.gtag!('config', accountId, {
      page_path: pagePath || window.location.pathname
    });
  });
};

/**
 * Track custom events
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, parameters);
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  trackEvent('form_submit', {
    form_name: formName,
    ...formData
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonName: string, metadata?: Record<string, any>) => {
  trackEvent('button_click', {
    button_name: buttonName,
    ...metadata
  });
};
