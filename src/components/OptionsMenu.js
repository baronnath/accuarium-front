// src/components/OptionsMenu.js

import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

function OptionsMenu({ children }) {

  return (
    <TouchableOpacity style={styles.container}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection : 'row-reverse',
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    right: theme.container.padding,
  },
});

export default memo(OptionsMenu);