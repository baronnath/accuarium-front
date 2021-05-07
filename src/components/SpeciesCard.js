// src/components/SpeciesCard.js

import React, { useState, memo } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Button, Card, Menu, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { axios } from '../helpers/axios';
import { backend } from '../../app';
import { theme } from '../theme';
import { handleAlert } from '../helpers/global';
import { actions as alertActions } from '../ducks/alert';


const SpeciesCard = ({ species, grid, ...props }) => {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const speciesImage = `${backend.imagesUrl}species/${species._id}.jpg`;

  function openMenu () { setVisible(true); }
  function closeMenu () { setVisible(false); }

  function addSpeciesToTank() {
    
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

  return( 
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
            right={(props) => <MaterialCommunityIcons {...props} name="tray-plus" onPress={() => {addSpeciesToTank()}} />}
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
            right={(props) => <MaterialCommunityIcons {...props} name="tray-plus" onPress={() => {addSpeciesToTank()}} />}
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
  rightStyle: {
    paddingRight: 15,
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginLeft: -5,
  }
});

export default memo(SpeciesCard);