// src/theme.js

import { DarkTheme } from 'react-native-paper';
import color from 'color';

// // Betta colors (green)
// export const theme = {
//   ...DarkTheme,
//   colors: {
//     ...DarkTheme.colors,
//     primary: '#7ECA9C',
//    	accent: '#CCFFBD',
//     secondary: '#CCFFBD',
//     // terciary: '#04decf',
//     // quaternary: '#04aad4',
//     // error: '#fd063c',
//     warning: '#ff9300',
//     // notification: '#ff9300',
//     text: '#ffffff',
//     lightText: '#969696',
//     // background: '#f6f6f6',
//     // placeholder: color('#000000').alpha(0.54).rgb().string(),
//     disabled: color('#ffffff').alpha(0.26).rgb().string(),
//     // paper: '#000000',
//     transparent: color('#000000').alpha(0).rgb().string(),
//   },
//   container: {
//     maxWidth: 400,
//     padding: 20,
//   },
//   bottomNav: {
//     height: 50,
//   },
// };


export const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#45a29e',
    accent: '#66fcf1',
    secondary: '#66fcf1',
    terciary: '#c5c6c7',
    // quaternary: '#ffc045',
    error: '#fc6b3f',
    warning: '#ec9b3b',
    notification: '#ff9300',
    text: '#c5c6c7',
    lightText: '#969696',
    background: '#000000',
    surface: '#0f1419',
    // onSurface: '#FFFFFF',
    placeholder: color('#c5c6c7').alpha(0.54).rgb().string(),
    disabled: color('#c5c6c7').alpha(0.26).rgb().string(),
    transparent: color('#000000').alpha(0).rgb().string(),
  },
  container: {
    maxWidth: 400,
    padding: 20,
  },
  bottomNav: {
    height: 50,
  },
};