// src/components/Tag.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { theme } from '../theme';

const Tag = ({callback, onClose, style, children, ...props}) => {
  return (
    <Chip
      mode="outlined"
      onPress={() => callback()}
      onClose={() => onClose()} 
      {...props}
    >
      {children}
    </Chip>
  );
}

const styles = StyleSheet.create({
  container: {
  },
});

export default memo(Tag);