// src/components/Searchbar.js

import { placeholder } from 'i18n-js';
import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar as PaperSearchbar } from 'react-native-paper';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof PaperSearchbar>;

const Searchbar = ({ ...props }: Props) => (
  <PaperSearchbar
      placeholder={placeholder}
      theme={theme}
      inputStyle={styles.input}
      style={styles.searchbar}
      {...props}
    />
);

const styles = StyleSheet.create({
  searchbar: {
    marginBottom: 10,
  },
  input: {

  },
});

export default memo(Searchbar);