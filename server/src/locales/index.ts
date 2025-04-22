import es from './es.json';

export const locales = {
  es
};

export type Locale = keyof typeof locales | 'en';

export const defaultLocale: Locale = 'en';

export default locales;
