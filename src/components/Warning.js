// src/components/Warning.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';
import { theme } from '../theme';

type Props = React.ComponentProps<typeof PaperCard>;

const Warning = ({ title, subtitle, left, style, onPress, ...props }) => (
  <PaperCard mode="outlined" style={[styles.card,style]} onPress={onPress}>
    <PaperCard.Title
        title={title}
        subtitle={subtitle}
        titleStyle={styles.title}
        subtitleStyle={styles.title}
        left={left}
    />
  </PaperCard>
);

const styles = StyleSheet.create({
  card: {
      flex: 1,
      alignSelf: 'stretch',
      marginTop: 25,
      backgroundColor: theme.colors.secondary,
      borderRadius: 5,
  },
  title: {
    color: theme.colors.background,
  },
});

export default memo(Warning);