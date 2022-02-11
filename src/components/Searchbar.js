// src/components/Searchbar.js

import React from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar as PaperSearchbar, withTheme } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { placeholder } from 'i18n-js';
import { theme } from '../theme';


function Searchbar(props) {

  return (
    <PaperSearchbar
      placeholder={placeholder}
      inputStyle={styles.input}
      style={styles.searchbar}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginBottom: 10,
  },
  input: {

  },
});

export default Searchbar;