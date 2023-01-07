// src/components/Header.js

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

const Header = ({ style, children }) => {

	return(
  	<Text style={[styles.header,style]}>{children}</Text>
	);
};

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontFamily: 'Aleo_700Bold',
    paddingVertical: theme.container.padding / 2,
    marginTop: theme.container.padding,
  },
});


export default memo(Header);