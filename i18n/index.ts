import AsyncStorage from '@react-native-async-storage/async-storage';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import de from './translations/de.json';
import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

const STORE_LANGUAGE_KEY = 'language';

const languageDetectorPlugin = {
  type: 'languageDetector' as const,
  async: true,
  init: () => {},
  detect: async (callback: (lng: string) => void) => {
    try {
      // Get stored language or default to 'en'
      const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
      if (language) {
        callback(language);
      } else {
        callback('en');
      }
    } catch (error) {
      console.log('Error reading language from storage', error);
      callback('en');
    }
  },
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
    } catch (error) {
      console.log('Error saving language to storage', error);
    }
  },
};

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  de: {
    translation: de,
  },
};

// eslint-disable-next-line import/no-named-as-default-member
i18next
  .use(languageDetectorPlugin)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;
