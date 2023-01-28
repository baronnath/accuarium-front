// src/components/Button.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../theme';
import color from 'color';

const Button = ({ mode, style, labelStyle, icon, disabled = false, compact = false, children, ...props }) => {
  let surface = false;
  if(mode === 'outlined' || mode === 'text')
    surface = true;

  let backgroundColor = theme.colors.primary;
  if (surface) 
    backgroundColor = theme.colors.paper;

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      marginVertical: 10,
      backgroundColor: disabled ? color(backgroundColor).alpha(0.12).rgb().string() : backgroundColor,
      justifyContent: 'center',
    },
    label: {
      color: theme.colors.surface,
      fontWeight: 'bold',
      fontSize: 15,
      lineHeight: 26,
    },
  });

  return(
    <PaperButton
      style={[
        styles.button,
        style,
      ]}
      labelStyle={[
        styles.label,
        surface && { color: theme.colors.primary },
        labelStyle
      ]}
      mode={mode}
      icon={icon} 
      theme={theme}
      // disabled={disabled}
      compact={compact}
      {...props}
    >
      {children}
    </PaperButton>
  )
};



export default memo(Button);