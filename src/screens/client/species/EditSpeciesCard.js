// src/screens/tank/EditSpeciesCard.js

import React, { useState, memo } from 'react';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Card, Menu, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { axios } from '../../../helpers/axios';
import Paragraph from '../../../components/Paragraph';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { backend } from '../../../../app.json';
import { theme } from '../../../theme';
import { handleAlert } from '../../../helpers/global';
import { actions as tankActions } from '../../../ducks/tank';
import { actions as alertActions } from '../../../ducks/alert';


const EditSpeciesCard = ({ species, quantity, main, handleSpecies, removeSpecies, ...props }) => {
  const user = useSelector(state => state.user.data);
  const tanks = useSelector(state => state.tanks.data);
  const locale = user.locale;  
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // const speciesImage = `${backend.imagesUrl}species/${species._id}.jpg`;
  const speciesImage = 'https://www.animalespeligroextincion.org/wp-content/uploads/2019/03/pez-betta.jpg'; // TO FIX :Remove when SSL in backend

  return( 
    <Card
      style={styles.card}
      theme={theme}
      {...props}
    >
      <Card.Title
        style={styles.cardContainer}
        title={species.name[locale]}
        subtitle={ species.scientificName}
        titleStyle={styles.title}
        subtitleStyle={styles.title}
        left={(props) => 
          <View style={styles.row}>
            <TouchableOpacity style={styles.verticalCenter}>
                <MaterialCommunityIcons
                  onPress={() => { removeSpecies(species._id) }}
                  name="close"
                  size={20}
                  color={theme.colors.lightText}
                />
            </TouchableOpacity>
            <View>
             <Image style={styles.listImage} source={{ uri: speciesImage }} />
             <View style={styles.absoluteCenter}
             > 
              { main ?
                  <MaterialCommunityIcons
                    onPress={() => { handleSpecies(species._id, 'main') }}
                    name="star"
                    size={26}
                    color={theme.colors.primary}
                  />
                :
                   <MaterialCommunityIcons
                    onPress={() => { handleSpecies(species._id, 'main') }}
                    name="star-outline"
                    size={26}
                    color={theme.colors.placeholder}
                  />
              }
              </View>
            </View>
          </View>
        }
        leftStyle={styles.leftStyle}
        right={
          (props) =>
            <View style={styles.row}>
              <TouchableOpacity style={styles.verticalCenter}>
                <MaterialCommunityIcons
                    onPress={() => { handleSpecies(species._id, 'remove') }}
                    name="minus-circle-outline"
                    size={26}
                    color={theme.colors.lightText}
                  />
              </TouchableOpacity>
              <Paragraph style={styles.quantity}>{quantity}</Paragraph>
              <TouchableOpacity style={styles.verticalCenter}>
                <MaterialCommunityIcons
                  onPress={() => { handleSpecies(species._id, 'add') }}
                  name="plus-circle-outline"
                  size={26}
                  color={theme.colors.lightText}
                />
              </TouchableOpacity>
            </View>
        }
        rightStyle={styles.rightStyle}
      />
    </Card>
  )
};

const styles = StyleSheet.create({
  card:{
    width: '100%',
    marginBottom: 20,
  },
  cardContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
  },
  title: {
    marginLeft: 15,
  },
  rightStyle: {
    justifyContent: 'center',
    marginLeft: 15,
  },
  leftStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listImage: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity:{
    fontSize: 25,
    lineHeight: 30,
    fontWeight: 'bold',
    marginBottom: 0,
    marginHorizontal: 5,
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
  },
  row: {
    flexDirection:'row',
  },
  verticalCenter: {
    alignSelf: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(EditSpeciesCard);