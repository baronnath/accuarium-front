// src/translator/tranlator.js

import { I18n } from "i18n-js";
import store from '../store';
import en from './translations/en';
import es from './translations/es';
import * as Localization from 'expo-localization';


const translations = {
    en: en,
    es: es,
  };

const i18n = new I18n(translations);
i18n.enableFallback = true;

export default (locale = null) => {
    if(!locale)
      locale = store.getState().user.data && store.getState().user.data.locale;

    if(!locale)
      locale = Localization.locale;

    i18n.locale = locale;
    return i18n;
}

