// src/components/Background.js

import React, { memo } from 'react';
import {
  ImageBackground,
  StyleSheet,
  View,
  ScrollView
} from 'react-native';
import { theme } from '../theme';



const Background = ({ justify, style, dynamic = true, children }) => {

  const contentContainerStyle = [
    styles.container,
    justify == 'top' ? styles.containerTop : styles.containerCenter,
    style
  ];

  return (
    dynamic ?
        <ScrollView
          style={styles.background}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      :
        <View
          style={[styles.background, contentContainerStyle, {paddingBottom: 0}]}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </View>
  );
};

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
