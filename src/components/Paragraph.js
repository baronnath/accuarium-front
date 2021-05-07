// src/components/Paragraph.js

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

type Props = {
  children: React.ReactNode;
};

const Paragraph = ({ style, children, ...props }) => (
  <Text style={[styles.text,style]}>{children}</Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 26,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default memo(Paragraph);