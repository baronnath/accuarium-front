// src/screens/client/tank/AddTank.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { ucFirst, isObject, clone } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import {
  StyleSheet, View, Platform, Image, Picker, FlatList, Item, Text, TouchableHighlight, TouchableOpacity, Dimensions, SafeAreaView
} from 'react-native';
import { ToggleButton, Checkbox } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Carousel from 'react-native-snap-carousel';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Paragraph from '../../../components/Paragraph';
import InputSuggestion from '../../../components/InputSuggestion';
import SpeciesCard from '../../../components/SpeciesCard';
import Tag from '../../../components/Tag';
import Spinner from '../../../components/Spinner';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/species';

export default function AddTank({ navigation }) {
  const user = useSelector(state => state.user.data);
  const locale = user.locale;

  const [page, setPage] = useState(0);
  const [species, setSpecies] = useState([]);
  const [users, setUsers] = useState([]);
  const [speciesFocused, setSpeciesFocused] = useState(false);
  const [userFocused, setUserFocused] = useState(false);
  const defaultTank = {
    values: {
      name: null,
      user: {
        name: null
      },
      species: [],
      speciesIds: [],
      mainSpeciesId: null,
      quantity: {},
      image: null,
      width: null,
      length: null,
      height: null,
      liters: null,
    },
    errors:{
      name: null,
      width: null,
      length: null,
      height: null,
      liters: null,
    }
  }
  const [tank, setTank] = useState(defaultTank);
  const [userKey, setUserKey] = useState(null);
  const [speciesKey, setSpeciesKey] = useState(null);
  const dispatch = useDispatch();

  const sliderWidth = Dimensions.get('window').width - (2*theme.container.padding);
  const sliderHeight = Dimensions.get('window').height - getStatusBarHeight() - theme.bottomNav.height;
  const [index, setIndex] = useState(0);
  const [carouselItems] =useState([
    {
        title:"Item 1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam turpis nisi, hendrerit sit amet luctus ut, luctus sit amet ipsum. Donec varius sapien blandit arcu egestas condimentum. Quisque at aliquet tortor. Ut eu nisi elit. Sed molestie tristique condimentum. Phasellus non diam erat. Cras interdum urna justo, nec mattis leo suscipit a. Nullam mollis ante risus, vitae feugiat enim consequat eu. Vestibulum molestie porttitor ipsum, vitae aliquam metus interdum vel. Curabitur nulla eros, ultrices sit amet consequat a, tincidunt posuere lorem. Mauris vestibulum egestas nisi sit amet suscipit. Aliquam erat volutpat. Nunc mattis tincidunt ligula, at tincidunt odio aliquam at. Cras facilisis nisi eget augue egestas condimentum. Fusce maximus, nulla quis pellentesque rhoncus, ligula massa euismod magna, sit amet tristique ipsum mi vel eros. Phasellus fermentum iaculis justo. Nulla non faucibus risus, a rhoncus velit. Suspendisse eget semper nisl. Curabitur condimentum vel nulla nec laoreet. Maecenas vitae feugiat lacus. Donec malesuada ante sed sem ultrices porttitor. Nunc eget dignissim nulla. Nam et tincidunt risus. Phasellus vitae nibh ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nulla lacus, sodales eu ex ac, scelerisque facilisis dolor. Nunc dolor erat, varius et consectetur sit amet, maximus in mauris.",
    },
    {
        title:"Item 2",
        text: "Text 2",
    },
    {
        title:"Item 3",
        text: "Text 3",
    },
    {
        title:"Item 4",
        text: "Text 4",
    },
    {
        title:"Item 5",
        text: "Text 5",
    },
  ]);

  async function handleChange(field, value) {
    setTank(prevTank => ({
      ...prevTank,
      values: { 
        ...prevTank.values,
        [field]: value
      }
    }));
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      handleChange('image', result);
    }

  };

  function calculateLiters() {
    const { width, height, length } = tank.values;
    const liters = width * height * length / 1000;
    handleChange('liters', String(liters));
    dispatch(alertActions.success(`Your tank is ${liters} liters`));
  }

  function onSubmit(){
    const validation = validator(species);
    
    if (validation !== false) {
      setTank(prevTank => ({
        ...prevTank,
        errors: {
          // name: validation.name,
          // minTemperature: validation.minTemperature,
          // maxTemperature: validation.maxTemperature,
          // minPh: validation.minPh,
          // maxPh: validation.maxPh,
          // minDh: validvalueation.minDh,
          // maxDh: validation.maxDh,
        }
      }));

      return;
    }

    // change objects to id strings
    let tankData = clone(tank.values);

    tankData.userId = tank.values.user._id;
    delete tankData.user;
    
    tankData.species.forEach(function(species, index) {
      // this[index] = species._id;
      tankData.speciesIds.push(species._id);
    }, tankData.species);
    delete tankData.species;

    console.log(tankData);

    axios.post(backend.url + '/tank', tankData)
    .then(res => {
      dispatch(alertActions.success(res.data.message));
      // setTank(defaultTank);
      // navigation.navigate('Tanks');
    })
    .catch(err => {
      handleAlert(err);  
    });
  }

  function _renderItem({item,index}){
      return (
        <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: sliderHeight,
            flex: 1
          }}>
          <Text style={{fontSize: 30}}>{item.title}</Text>
          <Text>{item.text}</Text>
        </View>

      )
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <Background>

        <View style={{ flex: 1}}>
            <Carousel
              data={carouselItems}
              sliderWidth={sliderWidth}
              itemWidth={sliderWidth}
              renderItem={_renderItem}
              onSnapToItem = { index => setIndex(index) }
            />
        </View>

      </Background>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
  },
  toggleContainer:{
    flexDirection: 'row',
  },
  toggleButton: {
    height:75,
    width:75,
    marginHorizontal: 3,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    padding: 0,
    overflow: "hidden",
    backgroundColor: theme.colors.background,
    marginBottom: 14,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  picker: {
    width: '100%',
    margin: 0,
    textAlign: 'left',
    zIndex: 1,
    paddingTop: 8,
    paddingBottom: 8,
  },
  itemPicker: {

  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 0,
  },
  inputWrap: {
    marginBottom: 0,
    flex: 1,
  },
  inputLeft: {
    marginTop: 0,
    marginBottom: 8,
    paddingRight: 8,
  },
  inputRight: {
    marginTop: 0,
    marginBottom: 8,    
  },
  tagContainer: {
    flex:1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderTopColor: theme.colors.lightText,
    borderTopWidth: 1,
    paddingTop: 8,
    width: '100%',
  },
  item: {
    flex:1,
    width: '100%',
  }
});