// src/screens/species/AddSpeciesQuantityModal.js

import React, { memo } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Paragraph from '../../../components/Paragraph';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';


const AddSpeciesQuantityModal = ({ isVisible, setVisible, setQuantity, quantity, submit, ...props }) => {
  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.tanks);
  const locale = user.locale;  
  const i18n = translator(locale);

  return( 
    <Modal isVisible={isVisible} setVisible={setVisible}>
      <Paragraph style={styles.modalTitle}>{i18n.t('speciesCard.modal2Title')}</Paragraph>
      <Paragraph style={styles.modalParagraph}>{i18n.t('speciesCard.modal2Paragraph')}</Paragraph>
      <View style={styles.quantityContainer}>
       <MaterialCommunityIcons size={50} name="minus-circle-outline" style={[styles.quantityModifier, quantity <= 1 && styles.disabled]} onPress={() => {quantity > 1 && setQuantity(quantity-1)}} />
       <Paragraph style={styles.quantity}>{quantity}</Paragraph>
       <MaterialCommunityIcons size={50} name="plus-circle-outline" style={styles.quantityModifier} onPress={() => {setQuantity(quantity+1)}} />
      </View>
      <Button style={styles.submitButton} onPress={() => {submit()}}>{i18n.t('speciesCard.addSpecies')}</Button>
    </Modal>
  )
};

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 30,
    lineHeight: 32,
    marginVertical: 15,
    marginBottom: 0,
  },
  modalParagraph: {
    marginTop: 0,
    color: theme.colors.lightText,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity:{
    fontSize: 80,
    lineHeight: 90,
    fontWeight: 'bold',
    marginBottom: 0,
    marginHorizontal: 15,
  },
  quantityModifier: {
    width: 50,
    color: theme.colors.primary,
  },
});

export default memo(AddSpeciesQuantityModal);