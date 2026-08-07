/**
 * Site-wide configuration
 * Centralized place for all URLs, contact info, and site metadata
 */

/**
 * Contact and membership URLs
 */
export const SITE_URLS = {
  /** Membership signup URL (BounceLife) */
  membership: 'https://www.bouncelife.com/events/68b5499b97ed25a0b6575d26?fbclid=PAdGRleANhILRleHRuA2FlbQIxMQABp6k6srKqrcOBFV8XukireeWni3fMEDaH8NlWesEF4mwzMI14gaaaZMhwRubr_aem_5BTDp3yljnkhH6SZ74a_Ng',

  /** Sponsorship inquiry email with pre-filled subject */
  sponsorEmail: 'mailto:boltubc@gmail.com?subject=Sponsorship Inquiry',

  /** General contact email */
  contactEmail: 'mailto:boltubc@gmail.com',
} as const;

/**
 * Social media profile URLs
 */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/bolt-ubc/',
  instagram: 'https://www.instagram.com/bolt.ubc/',
  facebook: 'https://www.facebook.com/BOLTUBC',
} as const;

/**
 * Helper function to get copyright text
 */
export const getCopyrightText = (): string => {
  return `Copyright © BOLT UBC ${new Date().getFullYear()}`;
};

/**
 * True on any deployment other than the real prod domain (staging previews,
 * localhost). Derived from NEXT_PUBLIC_SITE_URL so dev/prod visual markers
 * can live in shared code instead of diverging per-branch.
 */
export const IS_DEV_ENVIRONMENT = !(process.env.NEXT_PUBLIC_SITE_URL ?? '').includes('boltubc.com');

