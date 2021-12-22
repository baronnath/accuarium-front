// src/components/TextInput.js

import React, { memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput as Input } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof Input> & { errorText?: string };

const TextInput = ({ errorText, style, mode, icon, ...props }: Props) => (
  <View style={[styles.container, style]}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      mode={mode || "outlined"}
      theme={theme}
      {...props}
      right={icon ? <Input.Icon name={icon} color={theme.colors.lightText} /> : undefined}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '100%',
    marginVertical: 12,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4,
  },
});

export default memo(TextInput);