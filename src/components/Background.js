// src/components/Background.js

import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { theme } from '../theme';

type Props = {
  children: React.ReactNode;
};

const Background = ({ justify, style, children }: Props) => (
  <ImageBackground
    source={require('../assets/background_dot.png')}
    resizeMode="repeat"
    style={styles.background}
  >
    <KeyboardAvoidingView
      style={[
        styles.container,
        justify == 'top' ? styles.containerTop : styles.containerCenter,
        style
      ]}
      behavior="padding">
          {children}
    </KeyboardAvoidingView>
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
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
