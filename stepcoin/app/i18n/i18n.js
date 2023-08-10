import i18n from 'i18next';
import { initReactI18next } from "react-i18next";



//import translations
import translationEN from "./translations/english.json";
import translationJP from "./translations/japanese.json";


//Creating object with the variables of imported translation files
const resources = {
    en: {
      translation: translationEN,
    },
    jp: {
      translation: translationJP,
    },
  };



//i18N Initialization
i18n
.use(initReactI18next)
.init({
  compatibilityJSON: 'v3',
  resources: resources,
  lng:"en", //default language
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;