// src/components/TankCard.js

import React, { useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Card, Menu } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { axios } from '../helpers/axios';
import Paragraph from './Paragraph';
import Button from './Button';
import Modal from './Modal';
import { backend } from '../../app';
import { theme } from '../theme';
import { handleAlert } from '../helpers/global';
import { actions as tankActions } from '../ducks/tank';
import { actions as alertActions } from '../ducks/alert';


const TankCard = ({ tank, ...props }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const tankImage = `${backend.imagesUrl}tank/${tank._id}.jpg`;

  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  function deleteTank() {
    dispatch(tankActions.delete(tank._id));
    setModalVisible(false);
  }

  const menuButton = <MaterialCommunityIcons {...props} size={24} color={theme.colors.lightText} name="dots-vertical" onPress={() => {openMenu()}} />;

  const tankMenu = 
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={menuButton}>
      <Menu.Item icon="square-edit-outline" onPress={() => {}} title="Edit" />
      <Menu.Item icon="delete-forever-outline" onPress={() => { setVisible(false), setModalVisible(true) }} title="Remove" />
    </Menu>
  ;

  return(
    <>
      <Card
        style={styles.card}
        theme={theme}
        onPress={() => navigation.navigate('Tank', { tankId : tank._id }) }
        {...props}
      >
        <Card.Title
          title={tank.name}
          subtitle={ tank.liters ? <Paragraph>{tank.liters} L</Paragraph> : '' }
          right={(props) => tankMenu}
          rightStyle={styles.rightStyle}
        />
        <Card.Cover source={{ uri: tankImage }} />
      </Card>
      <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color={theme.colors.accent} />
        <Paragraph style={styles.modalTitle}>Are you sure?</Paragraph>
        <Paragraph style={styles.modalParagraph}>You won't be able to revert this</Paragraph>
        <View style={styles.buttonsContainer}>
          <Button
            onPress={() => deleteTank()}
            style={[styles.modalButton,styles.cancelButton]}
          >
            Remove
          </Button>
          <Button
            onPress={() => setModalVisible(false)}
            mode='outlined'
            style={styles.modalButton}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </>
  )
};

const styles = StyleSheet.create({
  card:{
    width: '100%',
    marginBottom: 20,
  },
  rightStyle: {
    paddingRight: 10,
  },
  modalTitle: {
    fontSize: 30,
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

export default memo(TankCard);