// src/screens/client/tank/SpeciesMenu.js

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Share } from 'react-native';
import * as Linking from 'expo-linking';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import AddSpeciesTankModal from './AddSpeciesTankModal';
import AddSpeciesQuantityModal from './AddSpeciesQuantityModal';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';

export default function SpeciesMenu({ species }) {

  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.tanks);
  const locale = user.locale;
  const i18n = translator(locale);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isMenuVisible, setMenuVisible] = useState(false);

  const [tankId, setTankId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isTankModalVisible, setTankModalVisible] = useState(false);
  const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);

  const menuButton = <MaterialCommunityIcons size={24} name="dots-vertical" style={styles.menuButton} color={theme.colors.text} onPress={() => {openMenu()}} />;

  function openMenu () { setMenuVisible(true); }
  function closeMenu () { setMenuVisible(false); }

  function addSpeciesToTank() {
    const params = {
      tankId: tankId,
      species: [{ 
        species: species._id,
        quantity: quantity,
        main: false,
      }]
    };
    dispatch(tankActions.addSpecies(params));
    setTankModalVisible(false);
    setQuantityModalVisible(false);
    setQuantity(1);
    setTankId(null);
  }

  async function shareSpecies() {
    try {
      await Share.share({
        message: i18n.t('species.shareButton.message', { name: species.scientificName, url: Linking.createURL(`species/${species._id}`) }),
        url: Linking.createURL(`species/${species._id}`),
        title: i18n.t('species.shareButton.title'),
      });
    }
    catch(err) {
      dispatch(alertActions.error(err.message));
    }
  }

	return (
    <>
      <Menu
        visible={isMenuVisible}
        onDismiss={closeMenu}
        anchor={menuButton}
      >
        <Menu.Item
          icon="tray-plus"
          onPress={ () => {
            setMenuVisible(false),
            setTankModalVisible(true)
          }}
          title={i18n.t('speciesCard.addSpecies')}
        />
        <Menu.Item
          icon="share-variant"
          onPress={ () => {
            setMenuVisible(false),
            shareSpecies();
          }}
          title={i18n.t('general.share')}
        />
      </Menu>

      {
        !!tanks.length &&
        <>
          <AddSpeciesTankModal 
            isVisible={isTankModalVisible}
            setVisible={setTankModalVisible}
            setQuantityModalVisible={setQuantityModalVisible}
            setTankId={setTankId}
          />
          <AddSpeciesQuantityModal
            isVisible={isQuantityModalVisible}
            setVisible={setQuantityModalVisible}
            setQuantity={setQuantity}
            quantity={quantity}
            submit={addSpeciesToTank}
          />
        </>
      }
    </>
  )
};

const styles = StyleSheet.create({
  menuButton: {
    paddingLeft: 5,
    paddingBottom: 5,
  },
});