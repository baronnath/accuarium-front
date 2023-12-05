// src/components/BackButton.js

import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

type Props = {
  goBack: () => void;
};

const BackButton = ({ navigation: { goBack } }) => (
  <TouchableOpacity onPress={() => goBack()} style={styles.container}>
    <MaterialCommunityIcons
      name="chevron-left"
      size={36}
      color={theme.colors.lightText}
      style={{marginTop: theme.container.padding}}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    paddingRight: 8,
    marginTop: 0,
    // position: 'absolute',
    // top: 10 + getStatusBarHeight(),
    // left: 10,
  },
});

export default memo(BackButton);