// src/components/TankCard.js

import React, { useState, memo } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button, Card, Menu, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { axios } from '../helpers/axios';
import { backend } from '../../app';
import { theme } from '../theme';
import { handleAlert } from '../helpers/global';
import { actions as alertActions } from '../ducks/alert';


const TankCard = ({ tank, ...props }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const tankImage = `${backend.imagesUrl}tank/${tank._id}.jpg`;

  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  function deleteTank() {
    axios.delete(backend.url + '/tank', {params: {tankId: tank._id}})
      .then(res => {
        dispatch(alertActions.success(res.data.message));
        navigation.push('Tanks');
      })
      .catch(err => {
        handleAlert(err);          
      })
      .finally(() => {
        setVisible(false);
      });
  }

  const menuButton = <MaterialCommunityIcons {...props} size={24} color={theme.colors.lightText} name="dots-vertical" onPress={() => {openMenu()}} />;

  const tankMenu = 
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={menuButton}>
      <Menu.Item icon="square-edit-outline" onPress={() => {}} title="Edit" />
      <Menu.Item icon="delete-forever-outline" onPress={() => {deleteTank()}} title="Remove" />
    </Menu>
  ;

  return(
    <Card
      style={styles.card}
      theme={theme}
      onPress={() => navigation.navigate('Tank', { tankId : tank._id }) }
      {...props}
    >
      <Card.Title
        title={tank.name}
        subtitle={ tank.liters ? <Text>{tank.liters} L</Text> : '' }
        right={(props) => tankMenu}
        rightStyle={styles.rightStyle}
      />
      <Card.Cover source={{ uri: tankImage }} />
    </Card>
  )
};

const styles = StyleSheet.create({
  card:{
    width: '100%',
    marginBottom: 20,
  },
  rightStyle: {
    paddingRight: 10,
  }
});

export default memo(TankCard);