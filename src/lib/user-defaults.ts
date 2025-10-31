import { Country } from '@prisma/client';

/**
 * Default settings applied when account is created
 * Ensures a default profile for every user so that
 * the UI has an image to render
 */
const DEFAULT_SETTINGS = {
  units: 'imperial',
  country: Country.USA,
  theme: 'light',
  profilePicture: '/images/avatars/default.jpg',
};

export default DEFAULT_SETTINGS;
