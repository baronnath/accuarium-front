// src/components/Button.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof PaperButton>;

const Button = ({ mode, style, children, ...props }: Props) => (
  <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={[
      styles.label,
      mode === 'outlined' && { color: theme.colors.primary },
    ]}
    mode={mode}
    theme={theme}
    {...props}
  >
    {children}
  </PaperButton>
);

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