// src/screens/tank/TankCard.js

import React, { useState, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Menu } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TankDeleteModal from './TankDeleteModal';
import Paragraph from '../../../components/Paragraph';
import { backend } from '../../../../app.json';
import { theme } from '../../../theme';
import { handleAlert } from '../../../helpers/global';
import translator from '../../../translator/translator';

const TankCard = ({ tank, ...props }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const tankImage = `${backend.imagesUrl}tank/${tank._id}.jpg`;

  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  const menuButton = <MaterialCommunityIcons {...props} size={24} color={theme.colors.lightText} name="dots-vertical" onPress={() => {openMenu()}} />;

  const tankMenu =
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={menuButton}>
      <Menu.Item
        icon="square-edit-outline"
        onPress={() => {
          setVisible(false),
          navigation.navigate('EditTank', { tankId : tank._id })
        }}
        title={i18n.t('general.edit')}
      />
      <Menu.Item
        icon="delete-forever-outline"
        onPress={() => {
          setVisible(false),
          setDeleteModalVisible(true)
        }}
        title={i18n.t('general.delete')}
      />
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
      <TankDeleteModal tankId={tank._id} isVisible={isDeleteModalVisible} setVisible={setDeleteModalVisible} />
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
});

export default memo(TankCard);
