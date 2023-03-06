// src/components/Spinner.js

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { theme } from '../theme';

const Spinner = ({ animating = true, ...props}) => (
  	<ActivityIndicator animating={animating} style={styles.spinner} theme={theme} />
);

const styles = StyleSheet.create({
	spinner:{
		flex:1,
		alignSelf: 'center',
	},
});

export default memo(Spinner);
