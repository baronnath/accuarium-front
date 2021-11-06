// src/screens/client/tank/TankDeleteModal.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Paragraph from '../../../components/Paragraph';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ucFirst } from '../../../helpers/helpers';
import { actions as tankActions } from '../../../ducks/tank';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function TankDeleteModal({ tankId, isVisible, setVisible, ...props }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const dispatch = useDispatch();

	function deleteTank() {
    dispatch(tankActions.delete(tankId));
    setVisible(false);
  }

	return (
		<Modal isVisible={isVisible} setVisible={setVisible}>
      <MaterialCommunityIcons name="alert-circle-outline" size={60} color={theme.colors.accent} />
      <Paragraph style={styles.modalTitle}>{i18n.t('tank.deleteModal.title')}</Paragraph>
      <Paragraph style={styles.modalParagraph}>{i18n.t('tank.deleteModal.description')}</Paragraph>
      <View style={styles.buttonsContainer}>
        <Button
          onPress={() => deleteTank()}
          style={[styles.modalButton,styles.cancelButton]}
        >
          Remove
        </Button>
        <Button
          onPress={() => setVisible(false)}
          mode='outlined'
          style={styles.modalButton}
        >
          {i18n.t('general.cancel')}
        </Button>
      </View>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 30,
    lineHeight: 30,
  },
  modalParagraph: {
    color: theme.colors.lightText,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: theme.colors.accent,
  }
});