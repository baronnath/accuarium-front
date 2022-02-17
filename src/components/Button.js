// src/components/Button.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../theme';

const Button = ({ mode, style, icon, children, ...props }) => {
  let surface = false;
  if(mode === 'outlined' || mode === 'text')
    surface = true;

  return(
    <PaperButton
      style={[
        styles.button,
        surface && { backgroundColor: theme.colors.paper },
        style,
      ]}
      labelStyle={[
        styles.label,
        surface && { color: theme.colors.primary },
      ]}
      mode={mode}
      icon={icon} 
      theme={theme}
      {...props}
    >
      {children}
    </PaperButton>
  )
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);