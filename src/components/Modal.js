// src/components/Modal.js

import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal as PaperModal, Portal, Provider } from 'react-native-paper';
import { theme } from '../theme';

const Modal = ({ isVisible, setVisible, children, ...props }) => {

	return (
		<Portal>
		  <PaperModal visible={isVisible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.container}>
		    {children}
		  </PaperModal>
		 </Portal>
  );
};

const styles = StyleSheet.create({
	container:{
    maxHeight: '80%',
   	alignItems: 'center',
		backgroundColor: theme.colors.surface,
		marginHorizontal: theme.container.padding * 2,
		padding: theme.container.padding,
		borderRadius: theme.roundness,
		borderWidth: 1,
		borderColor: theme.colors.terciary,
	},
});

export default memo(Modal);