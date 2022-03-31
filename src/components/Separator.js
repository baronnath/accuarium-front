// src/components/Separator.js

import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../theme';

function Separator({ style }) {

  return (
    <View style={[styles.separator,style]}>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    flex:1,
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    marginBottom: theme.container.padding,
    width: '100%',
    alignSelf: 'center',
  },
});

export default memo(Separator);