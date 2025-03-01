import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Import translation files from the locales folder
import en from './locales/en.json';
import hi from './locales/hi.json';
import bn from './locales/bn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';
import pa from './locales/pa.json';
import ml from './locales/ml.json';
import kn from './locales/kn.json';
import or from './locales/or.json';
import ur from './locales/ur.json';
import as from './locales/as.json';

// Initialize i18next with the imported languages
const i18nInstance = i18n.use(initReactI18next);

i18nInstance.init({
  compatibilityJSON: 'v3',
  lng: Localization.locale.split('-')[0], // e.g., "en", "hi", etc.
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    bn: { translation: bn },
    ta: { translation: ta },
    te: { translation: te },
    gu: { translation: gu },
    mr: { translation: mr },
    pa: { translation: pa },
    ml: { translation: ml },
    kn: { translation: kn },
    or: { translation: or },
    ur: { translation: ur },
    as: { translation: as },
  },
  interpolation: {
    escapeValue: false, // React already safes from XSS
  },
  react: {
    useSuspense: false,
  },
});

export default i18nInstance;
