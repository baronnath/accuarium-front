// src/components/Surface.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Surface as PaperSurface } from 'react-native-paper';
import { theme } from '../theme';

const Surface = ({ elevation = 1 , justify = 'center', style, color, children, ...props }) => {

  let st = {
    surface: {
      elevation: elevation,
      margin: theme.container.padding,
      borderRadius: theme.roundness,
      justifyContent: justify,
      padding: theme.container.padding,
    },
  };

  // Color conditional must be added later to the style. If a default color is added in the style, the surface elevation color will be overwritten
  if(color){
    st.surface.backgroundColor = color;
  }

  const styles = StyleSheet.create(st);


  return(
    <PaperSurface style={[styles.surface, style]} {...props}>
      {children}
    </PaperSurface>
  )
};

export default memo(Surface);