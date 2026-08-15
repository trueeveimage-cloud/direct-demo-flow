export type GoogleAdsConversion = 'concept_request' | 'payment_success';

const CONSENT_STORAGE_KEY = 'nomia_cookie_consent';
let googleTagLoaded = false;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function tagId() {
  return import.meta.env.VITE_GOOGLE_TAG_ID?.trim();
}

function ensureGtag() {
  if (typeof window === 'undefined') return false;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
  return true;
}

export function initializeGoogleConsent() {
  if (!ensureGtag() || !window.gtag) return;
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  if (window.localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted') {
    grantGoogleConsent();
  }
}

export function grantGoogleConsent() {
  const id = tagId();
  if (!id || !ensureGtag() || !window.gtag) return;

  window.gtag('consent', 'update', {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
  });

  if (googleTagLoaded) return;
  googleTagLoaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  script.dataset.nomiaGoogleTag = id;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
}

export function denyGoogleConsent() {
  if (!ensureGtag() || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
}

function conversionTarget(conversion: GoogleAdsConversion) {
  const id = tagId();
  if (!id) return undefined;
  const label = conversion === 'concept_request'
    ? import.meta.env.VITE_GOOGLE_ADS_CONCEPT_LABEL?.trim()
    : import.meta.env.VITE_GOOGLE_ADS_PAYMENT_LABEL?.trim();
  return label ? `${id}/${label}` : undefined;
}

export function trackGoogleAdsConversion(
  conversion: GoogleAdsConversion,
  options: { transactionId?: string; value?: number; currency?: string } = {},
) {
  if (
    typeof window === 'undefined' ||
    window.localStorage.getItem(CONSENT_STORAGE_KEY) !== 'accepted' ||
    !window.gtag
  ) return;

  const sendTo = conversionTarget(conversion);
  if (!sendTo) return;

  window.gtag('event', 'conversion', {
    send_to: sendTo,
    transaction_id: options.transactionId,
    value: options.value,
    currency: options.currency,
  });
}
