// src/components/Tag.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { theme } from '../theme';

const Tag = ({callback, onClose, style, children, ...props}) => {
  if(!callback)
    callback = () => {};

  if(onClose){
    return (
      <Chip
       style={[style, styles.chip]}
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
       style={[style, styles.chip]}
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
    marginRight: 2,
  },
});

export default memo(Tag);