// src/screens/species/SpeciesCard.js

import React, { useState, useEffect, memo } from 'react';
import { StyleSheet, Image, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Paragraph from '../../../components/Paragraph';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { theme } from '../../../theme';
import { handleAlert } from '../../../helpers/global';
import translator from '../../../translator/translator';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';


const SpeciesCard = ({ species, grid, main = null, setMain, ...props }) => {
  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.tanks);
  const locale = user.locale;  
  const i18n = translator(locale);
  const navigation = useNavigation();
  const dispatch = useDispatch();


  const [tankId, setTankId] = useState(main);
  const [quantity, setQuantity] = useState(1);
  const [isTankModalVisible, setTankModalVisible] = useState(false);
  const [isQuantityModalVisible, setQuantityModalVisible] = useState(false);

  // const speciesImage = `${backend.imagesUrl}species/${species._id}.jpg`;
  const speciesImage = 'https://www.animalespeligroextincion.org/wp-content/uploads/2019/03/pez-betta.jpg'; // TO FIX :Remove when SSL in backend
  
  function addSpeciesToTank() {
    const params = {
      tankId: main ? main : tankId,
      species: [{ 
        species: species._id,
        quantity: quantity,
        main: !!main,
      }]
    };
    dispatch(tankActions.addSpecies(params));
    setTankModalVisible(false);
    setQuantityModalVisible(false);
    setQuantity(1);
    setTankId(null);
    if(main) setMain(null); // Only first species added is main species, deactivate for next species
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
              title={species.name[locale]}
              subtitle={ species.scientificName}
              right={(props) => !!tanks.length && <MaterialCommunityIcons {...props} name="tray-plus" onPress={() => { main ? setQuantityModalVisible(true) : setTankModalVisible(true) }} /> }
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
              title={species.name[locale]}
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
          <Modal isVisible={isQuantityModalVisible} setVisible={setQuantityModalVisible}>
            <Paragraph style={styles.modalTitle}>{i18n.t('speciesCard.modal2Title')}</Paragraph>
            <Paragraph style={styles.modalParagraph}>{i18n.t('speciesCard.modal2Paragraph')}</Paragraph>
            <View style={styles.quantityContainer}>
             <MaterialCommunityIcons size={50} name="minus-circle-outline" style={[styles.quantityModifier, quantity <= 1 && styles.disabled]} onPress={() => {quantity > 1 && setQuantity(quantity-1)}} />
             <Paragraph style={styles.quantity}>{quantity}</Paragraph>
             <MaterialCommunityIcons size={50} name="plus-circle-outline" style={styles.quantityModifier} onPress={() => {setQuantity(quantity+1)}} />
            </View>
            <Button style={styles.submitButton} onPress={() => {addSpeciesToTank()}}>{i18n.t('speciesCard.addSpecies')}</Button>
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
    maxHeight: '70%',
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