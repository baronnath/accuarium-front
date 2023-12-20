// src/screens/client/tank/UserDeleteModal.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Paragraph from '../../../components/Paragraph';
import Modal from '../../../components/Modal';
import Button from '../../../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ucFirst } from '../../../helpers/helpers';
import { actions as userActions } from '../../../ducks/user';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function UserDeleteModal({ isVisible, setVisible, ...props }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const dispatch = useDispatch();

	function deleteUser() {
    dispatch(userActions.delete(user));
    setVisible(false);
  }

	return (
		<Modal isVisible={isVisible} setVisible={setVisible}>
      <MaterialCommunityIcons name="alert-circle-outline" size={60} color={theme.colors.warning} />
      <Paragraph style={styles.modalTitle}>{i18n.t('user.deleteModal.title')}</Paragraph>
      <Paragraph style={styles.modalParagraph}>{i18n.t('user.deleteModal.description')}</Paragraph>
      <View style={styles.buttonsContainer}>
        <Button
          onPress={() => deleteUser()}
          style={[styles.modalButton,styles.cancelButton]}
        >
          {i18n.t('general.delete')}
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
    backgroundColor: theme.colors.warning,
  }
});