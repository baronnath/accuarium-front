// src/components/Tag.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { theme } from '../theme';

const Tag = ({callback, onClose, style, textStyle, children, ...props}) => {
  if(!callback)
    callback = () => {};

  if(onClose){
    return (
      <Chip
        style={[styles.chip, style]}
        textStyle={[styles.chipTextStyle, textStyle]}
        mode="outlined"
        onClose={() => onClose()} 
        onPress={() => callback()}
        {...props}
      >
        {children}
      </Chip>
    );
  }else{
    return (
      <Chip
        style={[styles.chip, style]}
        textStyle={[styles.chipTextStyle, textStyle]}
        mode="outlined"
        mode="outlined"
        onPress={() => callback()}
        {...props}
      >
        {children}
      </Chip>
    );
  }
}

const styles = StyleSheet.create({
  chip: {
    marginRight: theme.container.padding / 4,
  },
  chipTextStyle: {
    lineHeight: 10,
  }
});

export default memo(Tag);