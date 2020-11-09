// src/components/Spinner.js

import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { theme } from '../theme';

const Spinner = () => (
  <ActivityIndicator animating={true} style={styles.spinner} theme={theme} />
);

const styles = StyleSheet.create({
	spinner:{

	},
});

export default memo(Spinner);
