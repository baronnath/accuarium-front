// src/components/SpeciesCard.js

import React, { useState, memo } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Card, Menu, List } from 'react-native-paper';
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


const SpeciesCard = ({ species, grid, ...props }) => {
  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.data);
  const locale = user.locale;  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const speciesImage = `${backend.imagesUrl}species/${species._id}.jpg`;

  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  function addSpeciesToTank(tankId) {
    const params = {
      tankId: tankId,
      species: [{ 
        species: species._id,
      }]
    };
    dispatch(tankActions.addSpecies(params));
    setModalVisible(false);
  }

  return( 
    <>
      {
        grid ?
          <Card
            style={styles.card}
            theme={theme}
            onPress={() => navigation.navigate('Species', { speciesId : species._id }) }
            {...props}
          >
            <Card.Title
              title={species.name.es}
              subtitle={ species.scientificName}
              right={(props) => !!tanks.length && <MaterialCommunityIcons {...props} name="tray-plus" onPress={() => {setModalVisible(true)}} />}
              rightStyle={styles.rightStyle}
            />
            <Card.Cover source={{ uri: speciesImage }} />
          </Card>
        :
           <Card
            style={styles.card}
            theme={theme}
            onPress={() => navigation.navigate('Species', { speciesId : species._id }) }
            {...props}
          >
            <Card.Title
              title={species.name.es}
              subtitle={ species.scientificName}
              left={(props) => <Image style={styles.listImage} source={{ uri: speciesImage }} />}
              right={(props) => !!tanks.length && <MaterialCommunityIcons {...props} name="tray-plus" onPress={() => {setModalVisible(true)}} />}
              rightStyle={styles.rightStyle}
            />
          </Card>
      }
      {
        !!tanks.length &&
        <Modal isVisible={isModalVisible} setVisible={setModalVisible}>
          <MaterialCommunityIcons name="fishbowl-outline" size={60} color={theme.colors.accent} />
          <Paragraph style={styles.modalTitle}>Which tank</Paragraph>
          <Paragraph style={styles.modalParagraph}>do you want to add this species to?</Paragraph>
          <View style={styles.listContainer}>
           {
            tanks.map(tank => {
              return (
                <List.Item
                  style={styles.list}
                  title={tank.name}
                  description={tank.liters && `${tank.liters} L`}
                  right={props => <MaterialCommunityIcons {...props} style={styles.listRight} size={28} name="tray-plus" onPress={() => {addSpeciesToTank(tank._id)}} />}
                />
              )
            })
          } 
          </View>
        </Modal>
      }
    </>
  )
};

const styles = StyleSheet.create({
  card:{
    width: '100%',
    marginBottom: 20,
  },
  rightStyle: {
    paddingRight: 15,
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: -5,
  },
  modalTitle: {
    fontSize: 30,
    marginVertical: 15,
    marginBottom: 0,
  },
  modalParagraph: {
    marginTop: 0,
    color: theme.colors.lightText,
  },
  listContainer: {
    width: '100%',
  },
  list:{
    paddingVertical: 10,
  },
  listRight: {
    alignSelf: 'center',
  },
});

export default memo(SpeciesCard);