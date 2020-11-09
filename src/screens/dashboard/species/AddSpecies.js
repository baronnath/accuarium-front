// src/screens/dashboard/species/AddSpecies.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios }from '../../../helpers/axios';
import { ucFirst } from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, Image, Picker } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import MenuButton from '../../../components/MenuButton';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import Searchbar from '../../../components/Searchbar';
import SpeciesCard from '../../../components/SpeciesCard';
import Spinner from '../../../components/Spinner';
import { actions as alertActions } from '../../../ducks/alert';
import { theme } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import validator from '../../../validators/species';

export default function AddSpecies({ navigation }) {
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [types, setTypes] = useState(null);
  const [families, setFamilies] = useState(null);
  const [depths, setDepths] = useState(null);
  const [behaviors, setBehaviors] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const defaultSpecies = {
    values: {
      image: null,
      name: null,
      otherNames: [],
      family: null,
    },
    errors:{
      image: null,
      name: null,
      otherNames: [],
      type: null,
      family: null,
    }
  }
  const [species, setSpecies] = useState(defaultSpecies);
  const dispatch = useDispatch();
   
  useEffect(() => {

    async function checkPlatform(){
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    }
    checkPlatform();

    // Get types
    axios.get(backend.url + '/types')
      .then(res => {
          setTypes(res.data.types);
      })
      .catch(err => {
          handleAlert(err);          
      });

    // Get families
    axios.get(backend.url + '/families')
      .then(res => {
          setFamilies(res.data.families);
      })
      .catch(err => {
          handleAlert(err)
      });

    // Get depth
    axios.get(backend.url + '/depths')
      .then(res => {
          setDepths(res.data.depths);
      })
      .catch(err => {
          handleAlert(err);          
      });

    // Get behaviors
    axios.get(backend.url + '/behaviors')
      .then(res => {
          setBehaviors(res.data.behaviors);
      })
      .catch(err => {
          handleAlert(err);          
      });

      // Get feeds
    axios.get(backend.url + '/feeds')
      .then(res => {
          setFeeds(res.data.feeds);
      })
      .catch(err => {
          handleAlert(err);          
      });
  }, []);

  function handleChange(field, value) {
    setSpecies(prevSpecies => ({
      ...prevSpecies,
      values: { 
        ...prevSpecies.values,
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
    });

    if (!result.cancelled) {
      handleChange('image', result.uri);
    }

  };

  function onSubmit(){
    const validation = validator(species);
    
    if (validation !== false) {
      setSpecies(prevSpecies => ({
        ...prevSpecies,
        errors: {
          name: validation.name,
        }
      }));

      return;
    }

    let formData = new FormData();

    formData.append('name', species.values.name);
    formData.append('typeId', species.values.type);
    formData.append('familyId', species.values.family);
    
    // Infer the type of the image
    if(species.values.image){
      let fileName = species.values.image.split('/').pop();
      let match = /\.(\w+)$/.exec(fileName);
      let fileType = match ? `image/${match[1]}` : `image`;
      formData.append('image', {
        uri: Platform.OS === 'android' ? species.values.image : species.values.image.replace('file://', ''),
        name: species.values.name,
        type: fileType,
      });
    }

    axios
      .post(backend.url + '/species', formData, {
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
              'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVlOGNkZDNiODI5NjUyMzQ2NGM3NDYxYSIsImVtYWlsIjoiYWRtaW5AZGlvbG9neS5pbyIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOnsiaWQiOiI1ZThjZGQzYjgyOTY1MjM0NjRjNzQ2MGUiLCJuYW1lIjoiYWRtaW4ifX0sImlhdCI6MTYwMjI4NzI3OCwiZXhwIjoxNjA0ODc5Mjc4fQ.c8NSjzVPlagHquv6PTXS5mEK4XUbbgepd8u75MYgnE4",
          },

      })
      .catch(error => {
          throw error;
      });

    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Content-Type", "multipart/form-data");
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVlOGNkZDNiODI5NjUyMzQ2NGM3NDYxYSIsImVtYWlsIjoiYWRtaW5AZGlvbG9neS5pbyIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOnsiaWQiOiI1ZThjZGQzYjgyOTY1MjM0NjRjNzQ2MGUiLCJuYW1lIjoiYWRtaW4ifX0sImlhdCI6MTYwMjQ2Njc2MSwiZXhwIjoxNjA1MDU4NzYxfQ.0sBn38ErtgnNkE_JN908yisLMRqC44-51zYP6osOVo4");


    // axios.defaults.headers['Content-Type'] = 'multipart/form-data';
    // axios.defaults.headers['Content-Type'] = `multipart/form-data; boundary=${formData._boundary}`;
    // axios.post(backend.url + '/species', formData, { 
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "multipart/form-data",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "POST",
    //     "Access-Control-Allow-Headers": "Content-Type, Authorization",
    //     "Access-Control-Allow-Credentials": "true",
    //   }
    // })

    // axios.post(backend.url + '/species', formData, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }})
//     fetch(backend.url + '/species', {
//   method: 'POST',
//   headers: myHeaders,
//   body: formData,
//   redirect: 'follow'
// })
    // .then(res => {
    //   console.log(res);
    //   dispatch(alertActions.success(res.data.message));
    //   setSpecies(defaultSpecies);
    //   navigation.navigate('Livestock');
    // })
    // .catch(err => {
    //   console.log(err);
    //   handleAlert(err);  
    //   setLoading(false);
    // });
  }

  function handleAlert(err){
    let message;
    err.response
        ? message = err.response.data.message
        : message = 'Server connection error'
    dispatch(alertActions.error(message));
  }

  return (
    <Background justify="top">
      <MenuButton />
      <Header>
        New species
      </Header>

      <View style={styles.toggleContainer}>
        { !types ?
            <Spinner />
          :
            types.map(type => {     
              return (
                <ToggleButton
                  icon={type.icon}xºx
                  value={type._id}
                  onPress={() => handleChange('type', type._id)}
                  status={species.values.type == type._id ? 'checked' : 'unchecked'}
                  style={styles.toggleButton}
                  theme={theme}
                  color={species.values.type == type._id ? theme.colors.primary : theme.colors.lightText}
                  size={40}
                />
              )
            })
        }
      </View>

      <TextInput
        label="Name"
        name="name"
        returnKeyType="next"
        value={species.values.name}
        onChangeText={(name) => handleChange('name', name)}
        error={!!species.errors.name}
        errorText={species.errors.name}
        autoCapitalize="none"
        autofill="name"
      />

      <View style={styles.pickerContainer}>
        { !families ?
            <Spinner />
          :
            <Picker
              selectedValue={species.values.family}
              style={
                styles.picker,
                species.values.family ? { color: theme.colors.text } : { color: theme.colors.placeholder }
              }
              itemStyle={styles.itemPicker}
              onValueChange={(family) => handleChange('family', family)}
            >
              <Picker.Item label="Select family" value={null} />
              {
                families.map(family => {    
                  return (
                    <Picker.Item label={ucFirst(family.name)} value={family._id} />
                  )
                })
              }
            </Picker>
        }
      </View>

      { species.values.image && <Image source={{ uri: species.values.image }} style={{ width: 200, height: 200 }} /> }
      <Button onPress={pickImage} >Pick an image</Button>
      <Button onPress={onSubmit} >Send</Button>

    </Background>
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

  }
});