// src/screens/tank/TankCard.js

import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Menu } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TankDeleteModal from './TankDeleteModal';
import TankMenu from './TankMenu';
import Paragraph from '../../../components/Paragraph';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import GroupIcon from '../../../components/GroupIcon';
import unitConverter from '../../../helpers/unitConverter';
import { backend } from '../../../../app.json';
import { theme } from '../../../theme';
import { handleAlert } from '../../../helpers/global';
import { ucFirst } from '../../../helpers/helpers';
import { findMainSpecies } from '../../../helpers/tank';
import translator from '../../../translator/translator';

const TankCard = ({ tank, ...props }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.user.data);
  const locale = user.locale;
  const i18n = translator(locale);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [mainSpecies, setMainSpecies] = useState(null);

  const tankImage = `${backend.imagesUrl}tank/${tank._id}.jpg`;


  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  const menuButton = <MaterialCommunityIcons {...props} size={24} color={theme.colors.lightText} name="dots-vertical" onPress={() => {openMenu()}} />;

  useEffect(() => {
    if(tank.species.length){
      setMainSpecies(findMainSpecies(tank.species));
    }
  });

  return(
    <>
      <TouchableOpacity style={styles.card}
        theme={theme}
        onPress={() => navigation.navigate('Tank', { tankId : tank._id }) }
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: tankImage + '?' + new Date()}} // Date is added to avoid image to cache
            style={styles.image}
          />
        </View>
        <View style={styles.description}>
          <View style={styles.row}>
            <Header style={styles.title}>
              { tank.name } 
            </Header>
          </View>
          <View style={styles.row}>
            <Paragraph style={styles.volume}>{unitConverter(tank.liters, 'volume', 'base', user.units['volume']) + i18n.t('measures.' + user.units.volume + 'Abbr')}</Paragraph>
          </View>
          { !!mainSpecies &&
            <View style={styles.row}>
              <GroupIcon
                name={mainSpecies.species.group.icon} 
                color={theme.colors.accent}
                size={30}
              />
              <Paragraph style={styles.mainSpecies}>{ ucFirst(mainSpecies.species.name[locale]) }</Paragraph>
            </View>
          }
        </View>
        <View style={styles.menuContainer}>
          <TankMenu tankId={tank._id} deleteTank={setDeleteModalVisible} />
        </View>
        {/* <Card.Title
          title={tank.name}
          subtitle={ tank.liters ? <Paragraph>{tank.liters} L</Paragraph> : '' }
          right={(props) => tankMenu}
          rightStyle={styles.rightStyle}
        />
        <Card.Cover  />*/}
      </TouchableOpacity>
      <TankDeleteModal tankId={tank._id} isVisible={isDeleteModalVisible} setVisible={setDeleteModalVisible} />
    </>
  )
};

const styles = StyleSheet.create({
  card:{
    flex: 1,
    width: '100%',
    marginBottom: theme.container.padding / 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.container.padding / 2,
    paddingVertical: theme.container.padding / 4,
    borderRadius: theme.roundness,
    // justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  imageContainer:{
    flex: 3,
  },
  image: {
    flex: 1,
    // aspectRatio: 1.25,
    height: '100%',
    borderRadius: theme.roundness,
    resizeMode: 'contain',
  },
  description: {
    flex: 7,
    paddingLeft: theme.container.padding / 2,
    textAlign: 'left',
  },
  volume: {
    textAlign: 'left',
    alignSelf: 'flex-end',
    marginBottom: theme.container.padding * .2,
  },
  title: {
    paddingBottom: 0,
    marginTop: 0,
    color: theme.colors.text,
    fontSize: 20,
  },
  mainSpecies: {
    alignSelf: 'flex-end',
    marginLeft: theme.container.padding / 2,
    marginBottom: theme.container.padding * .25,
  },
  menuContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightStyle: {
    paddingRight: 10,
  },
});

export default memo(TankCard);
