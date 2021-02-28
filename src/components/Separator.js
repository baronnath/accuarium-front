// src/components/Separator.js

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';

function Separator() {

  return (
    <View style={styles.separator}>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    flex:1,
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingVertical: 8,
    width: '100%',
  },
});

export default memo(Separator);