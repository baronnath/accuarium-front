// src/components/Alert.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { theme } from '../theme';
import Snackbar from './Snackbar';
import { actions as alertActions } from '../ducks/alert';

function Alert(){
  const dismissSnackbar = () => dispatch(alertActions.clear());
	const dispatch = useDispatch();

  const alert = useSelector(state => state.alert);

  return (
    	<Snackbar
    	  visible={alert.visible}
    	  onDismiss={dismissSnackbar}
    	  type={ alert.type ? alert.type : 'success'}
    	  style={styles.container}
    	  action={{
          label: <Icon name="close" size={20} color={theme.colors.surface}/>,
          onPress: () => {
            dismissSnackbar
          },
        }}
        wrapperStyle={ styles.container }
      >
    		{alert.message}
			</Snackbar>
  );
}

const styles = StyleSheet.create({
	container: {
    maxWidth: theme.container.maxWidth,
    paddingHorizontal: theme.container.padding,
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 10 + getStatusBarHeight(),
    zIndex: 900,
  },
  snackbar: {
  },
});

export default memo(Alert);