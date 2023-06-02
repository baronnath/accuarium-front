// src/screens/client/tank/TankMenu.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { actions as alertActions } from '../../../ducks/alert';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function TankMenu({ tank, deleteTank }) {

  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isMenuVisible, setMenuVisible] = useState(false);

  const menuButton = <MaterialCommunityIcons size={24} name="dots-vertical" style={styles.menuButton} color={theme.colors.text} onPress={() => {openMenu()}} />;

  function openMenu () { setMenuVisible(true); }
  function closeMenu () { setMenuVisible(false); }

  async function shareTank() {
    try {
      await Share.share({
        message: i18n.t('tank.shareButton.message', { url: Linking.createURL(`tank/${tank._id}`) }),
        url: Linking.createURL(`tank/${tank._id}`),
        title: i18n.t('tank.shareButton.title'),
      });
    }
    catch(err) {
      dispatch(alertActions.error(err.message));
    }
  }

	return (
      <Menu
        visible={isMenuVisible}
        onDismiss={closeMenu}
        anchor={menuButton}
      >
        <Menu.Item
          icon="share-variant"
          onPress={ () => {
            setMenuVisible(false),
            shareTank();
          }}
          title={i18n.t('general.share')}
        />
        { tank.user._id == user._id &&
          <>
            <Menu.Item
              icon="square-edit-outline"
              onPress={ () => {
                setMenuVisible(false),
                navigation.navigate('EditTank', { tankId : tank._id })
              }}
              title={i18n.t('general.edit')}
            />
            <Menu.Item
              icon="delete-forever-outline"
              onPress={ () => {
                setMenuVisible(false),
                deleteTank(true)
              }}
              title={i18n.t('general.delete')}
            />
          </>
        }
      </Menu>
  )
};

const styles = StyleSheet.create({
  menuButton: {
    paddingLeft: 10,
    paddingBottom: 0,
  },
});