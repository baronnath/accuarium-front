// src/components/Snackbar.js

import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof PaperSnackbar>;

const Snackbar = ({ type, visible, style, wrapperStyle, children, ...props }: Props) => (
  <PaperSnackbar
    visible={visible}
    style={[
      styles.snackbar,
      styles[type],
      style,
    ]}
    wrapperStyle={[styles.wrapper, wrapperStyle]}
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
  warning: {
    backgroundColor: theme.colors.secondary,
  },
  wrapper: {
    maxWidth: theme.container.maxWidth,
    paddingHorizontal: theme.container.padding,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default memo(Snackbar);