// src/components/Subheader.js

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

const Subheader = ({ style, children }) => {

	return(
  	<Text style={[styles.header,style]}>{children}</Text>
	);
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.text,
    fontFamily: 'Aleo_700Bold',
    paddingVertical: theme.container.padding / 2,
  },
});


export default memo(Subheader);
