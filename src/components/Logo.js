// src/components/Logo.js

import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  <Image source={require('../assets/logo-icon.png')} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 86,
    height: 91,
    marginBottom: 12,
  },
});

export default memo(Logo);
