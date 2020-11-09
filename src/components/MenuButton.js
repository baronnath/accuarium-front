// src/components/MenuButton.js

import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../theme';

function MenuButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={navigation.openDrawer} style={styles.container}>
      <Icon name="dots-vertical" size={24} color={theme.colors.primary}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    left: 10,
  },
});

export default memo(MenuButton);