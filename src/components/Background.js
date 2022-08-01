// src/components/Background.js

import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { theme } from '../theme';

const Background = ({ justify, style, children }) => (

  <ScrollView
    style={styles.background}
    contentContainerStyle={[
      styles.container,
      justify == 'top' ? styles.containerTop : styles.containerCenter,
      style
    ]}
  >
    {children}
  </ScrollView>

);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: theme.container.padding,
    maxWidth: theme.container.maxWidth,
  },
  containerTop: {
    justifyContent: 'flex-start',
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Background);
