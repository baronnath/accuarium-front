// src/components/FixedAlert.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { theme } from '../theme';
import Snackbar from './Snackbar';
import { actions as alertActions } from '../ducks/alert';

function FixedAlert({ visible, type, style, wrapperStyle, onClose, children }){
  const dismissAlert = () => setVisible(false);
	const dispatch = useDispatch();

  const [vis, setVisible] = useState(visible);

  return (
    	<Snackbar
    	  visible={vis}
        duration={Infinity}
    	  onDismiss={dismissAlert}
    	  type={ type ? type : 'success'}
        wrapperStyle={[styles.wrapper, wrapperStyle]}
    	  style={[styles.container, style]}
    	  action={{
          label: <Icon name="close" size={20} color={theme.colors.surface}/>,
          onPress: () => {
            dismissAlert;
            onClose && onClose();
          },
        }}
      >
    		{children}
			</Snackbar>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    top: 0,
    right: 0,
  },
	container: {
    maxWidth: theme.container.maxWidth,
    margin: 0,
    minHeight: 50,
  },
});

export default memo(FixedAlert);