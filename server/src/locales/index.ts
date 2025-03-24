import en from './en.json';

export const locales = {
  en
};

export type Locale = keyof typeof locales;

export const defaultLocale: Locale = 'en';

export default locales;
