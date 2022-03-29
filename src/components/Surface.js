// src/components/Surface.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Surface as PaperSurface } from 'react-native-paper';
import { theme } from '../theme';

const Surface = ({ elevation = 1 , justify = 'center', style, children, ...props }) => {

  const styles = StyleSheet.create({
    surface: {
      elevation: elevation,
      margin: theme.container.padding,
      borderRadius: 5,
      justifyContent: justify,
      padding: theme.container.padding,
    },
  });

  return(
    <PaperSurface style={[styles.surface, style]} {...props}>
      {children}
    </PaperSurface>
  )
};

export default memo(Surface);