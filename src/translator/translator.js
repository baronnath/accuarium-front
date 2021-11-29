// src/translator/tranlator.js

import i18n from 'i18n-js';
import store from '../store';
import en from './translations/en';
import es from './translations/es';


i18n.translations = {
    en: en,
    es: es,
  };

i18n.fallbacks = true;

export default (locale = null) => {
    if(!locale)
      locale = store.getState().user.data && store.getState().user.data.locale;

    i18n.locale = locale;
    return i18n;
}

