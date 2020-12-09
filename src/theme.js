// src/theme.js

import { DefaultTheme } from 'react-native-paper';
import color from 'color';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#00bcba',
   	accent: '#ff9300',
    secondary: '#ff9300',
    terciary: '#04decf',
    quaternary: '#04aad4',
    error: '#fd063c',
    notification: '#ff9300',
    text: '#111111',
    lightText: '#969696',
    background: '#f6f6f6',
    placeholder: color('#000000').alpha(0.54).rgb().string(),
    disabled: color('#000000').alpha(0.26).rgb().string(),
  },
  container: {
    maxWidth: 340,
  }
};