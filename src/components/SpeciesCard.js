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
  const [tankId, setTankId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isTankModalVisible, setTankModalVisible] = useState(false);
  const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);

  const speciesImage = `${backend.imagesUrl}species/${species._id}.jpg`;

  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  function addSpeciesToTank() {
    const params = {
      tankId: tankId,
      species: [{ 
        species: species._id,
        quantity: quantity,
      }]
    };
    dispatch(tankActions.addSpecies(params));
    setTankModalVisible(false);
    setQuantityModalVisible(false);
    setQuantity(1);
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
              right={(props) => !!tanks.length && <MaterialCommunityIcons {...props} name="tray-plus" onPress={() => {setTankModalVisible(true)}} />}
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
              right={
                (props) => !!tanks.length &&
                  <MaterialCommunityIcons
                    {...props}
                    name="tray-plus"
                    onPress={() => {
                      setTankModalVisible(true);
                    }}
                  />
              }
              rightStyle={styles.rightStyle}
            />
          </Card>
      }
      {
        !!tanks.length &&
        <>
          <Modal isVisible={isTankModalVisible} setVisible={setTankModalVisible}>
            <MaterialCommunityIcons name="fishbowl-outline" size={60} color={theme.colors.accent} />
            <Paragraph style={styles.modalTitle}>Which tank</Paragraph>
            <Paragraph style={styles.modalParagraph}>do you want to add this species to?</Paragraph>
            <View style={styles.listContainer}>
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
            </View>
          </Modal>
          <Modal isVisible={isQuantityModalVisible} setVisible={setQuantityModalVisible}>
            <Paragraph style={styles.modalTitle}>How many</Paragraph>
            <Paragraph style={styles.modalParagraph}>do you want to add?</Paragraph>
            <View style={styles.quantityContainer}>
             <MaterialCommunityIcons size={50} name="minus-circle-outline" style={[styles.quantityModifier, quantity <= 1 && styles.disabled]} onPress={() => {quantity > 1 && setQuantity(quantity-1)}} />
             <Paragraph style={styles.quantity}>{quantity}</Paragraph>
             <MaterialCommunityIcons size={50} name="plus-circle-outline" style={styles.quantityModifier} onPress={() => {setQuantity(quantity+1)}} />
            </View>
            <Button style={styles.submitButton} onPress={() => {addSpeciesToTank()}}>Add species</Button>
          </Modal>
        </>
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
  },
  list:{
    paddingVertical: 10,
  },
  listRight: {
    alignSelf: 'center',
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
  disabled: {
    color: theme.colors.disabled,
  },
  submitButton: {
    backgroundColor: theme.colors.accent,
  }
});

export default memo(SpeciesCard);