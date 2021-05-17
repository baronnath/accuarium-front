// src/components/DottedSeparator.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { theme } from '../theme';

const DottedSeparator = ({ color }) => (
  <Svg  width="100%" height="6" style={styles.dotted}>
    <Line x1="2" y1="5" x2="1500" y2="5" stroke={color ? color : theme.colors.disabled} strokeWidth="2" strokeLineCap="round" strokeDasharray="2, 6" />
  </Svg>
);

export default DottedSeparator;

const styles = StyleSheet.create({
  dotted: {
    paddingVertical: 10,
  },
});