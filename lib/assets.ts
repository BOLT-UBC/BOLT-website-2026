/**
 * Utility functions for asset URL generation
 */

/**
 * Gets the base URL for public assets
 * @returns The base URL
 */
export const getBaseUrl = (): string => {
  return '/';
};

/**
 * Generates a full URL for a public asset
 * @param path - Relative path from the public directory
 * @returns Full URL to the asset
 * @example
 * getPublicAssetUrl('events/bootcamp.webp') // -> '/events/bootcamp.webp'
 */
export const getPublicAssetUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Generates a URL for a team member's profile picture
 * @param filename - Name of the profile picture file
 * @returns Full URL to the profile picture
 * @example
 * getProfileUrl('John.webp') // -> '/profiles/John.webp'
 */
export const getProfileUrl = (filename: string): string => {
  // List of available profile images
  const availableProfiles = [
    'AadeeshNargotra.webp', 'AaravAlaricBhatia.webp', 'AlexyLamoot.webp', 'AnneNguyen.webp',
    'AntaripKashyap.webp', 'ArnavDhablania.webp', 'BradleyWong.webp', 'CalistaValencia.webp',
    'ChiragRaisingh.webp', 'ChloeLee.webp', 'ChloeSepulveda.webp', 'DivjotVirdi.webp',
    'EleanorLam.webp', 'EthanLe.webp', 'FeliciaAmelia.webp', 'HannahGoharian.webp',
    'HarmanjeetSingh.webp', 'HarshitSethi.webp', 'JacobOCallaghan.webp', 'JessicaZhou.webp',
    'JoveWan.webp', 'KaiWu.webp', 'KiwiMottahed.webp', 'KyleGomez.webp', 'LeoShang.webp',
    'LucasHo.webp', 'ManyaGarg.webp', 'NavThukral.webp', 'NevanLeo.webp', 'NicoleLi.webp',
    'PrashantChopra.webp', 'RaghavAwasthi.webp', 'RuhaniMittal.webp'
  ];

  // If the requested profile exists, return it
  if (availableProfiles.includes(filename)) {
    return getPublicAssetUrl(`profiles/${filename}`);
  }

  // Otherwise, return a default placeholder
  return getPublicAssetUrl('profiles/default.webp');
};

/**
 * Generates a URL for an event image
 * @param filename - Name of the event image file
 * @returns Full URL to the event image
 * @example
 * getEventImageUrl('bootcamp.webp') // -> '/events/bootcamp.webp'
 */
export const getEventImageUrl = (filename: string): string => {
  return getPublicAssetUrl(`events/${filename}`);
};

