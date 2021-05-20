// src/components/Header.js

import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts, Aleo_700Bold } from '@expo-google-fonts/aleo';
import { theme } from '../theme';

const Header = ({ style, children }) => {
	let [fontsLoaded] = useFonts({
    Aleo_700Bold,
  });

	return(
		!fontsLoaded ?
			<AppLoading />
		:
	  	<Text style={[styles.header,style]}>{children}</Text>
	);
};

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    color: theme.colors.primary,
    fontFamily: 'Aleo_700Bold',
    paddingVertical: 14,
  },
});


export default memo(Header);