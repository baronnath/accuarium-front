// src/components/Snackbar.js

import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof PaperSnackbar>;

const Snackbar = ({ type, visible, style, children, ...props }: Props) => (
  <PaperSnackbar
    visible={visible}
    style={[
      styles.snackbar,
      styles.[type],
      style,
    ]}
    wrapperStyle={styles.wrapper}
    theme={theme}
    {...props}
  >
    {children}
  </PaperSnackbar>
);

const styles = StyleSheet.create({
  snackbar: {
  },
  success: {
    backgroundColor: theme.colors.primary,
  },
  error: {
    backgroundColor: theme.colors.error,
  },
  wrapper: {
  }
});

export default memo(Snackbar);