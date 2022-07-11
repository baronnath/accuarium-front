// src/screens/species/AddSpeciesTankModal.js

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


const AddSpeciesTankModal = ({ isVisible, setVisible, setQuantityModalVisible, setTankId, ...props }) => {
  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.tanks);
  const locale = user.locale;  
  const i18n = translator(locale);

  return( 
    <Modal isVisible={isVisible} setVisible={setVisible}>
      <MaterialCommunityIcons name="fishbowl-outline" size={60} color={theme.colors.accent} />
      <Paragraph style={styles.modalTitle}>{i18n.t('speciesCard.modal1Title')}</Paragraph>
      <Paragraph style={styles.modalParagraph}>{i18n.t('speciesCard.modal1Paragraph')}</Paragraph>
      <ScrollView style={styles.listContainer}>
        {
          tanks.map(tank => {
            return (
              <List.Item
                key={tank._id}
                style={styles.list}
                title={tank.name}
                description={tank.liters && `${tank.liters} L`}
                right={
                  props =>
                    <MaterialCommunityIcons
                      {...props}
                      style={styles.listRight}
                      size={28}
                      name="tray-plus"
                      onPress={() => {
                        setQuantityModalVisible(true);
                        setTankId(tank._id);
                      }}
                    />
                }
              />
            )
          })
        } 
      </ScrollView>
    </Modal>
  )
};

const styles = StyleSheet.create({
  listImageContainer: {
    justifyContent: 'center'
  },
  listImage: {
    width: '80%',
    height: 70,
    borderRadius: theme.roundness,
    resizeMode: 'contain',
  },
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
  listContainer: {
    width: '100%',
    maxHeight: '70%',
  },
});

export default memo(AddSpeciesTankModal);