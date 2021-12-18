// src/screens/dashboard/profile/Profile.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Api }from '../../../helpers/axios';  
import helpers from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, TouchableOpacity} from 'react-native';
import { Avatar, RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Subheader from '../../../components/Subheader';
import Button from '../../../components/Button';
import Dialog from '../../../components/Dialog';
import Paragraph from '../../../components/Paragraph';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { actions as userActions } from '../../../ducks/user';
import { actions as alertActions } from '../../../ducks/alert';
import { handleAlert } from '../../../helpers/global';
import { theme } from '../../../theme';
import translator from '../../../translator/translator';
import validator from '../../../validators/user';

export default function Profile({ route, navigation }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const [editedUser, seteditedUser] = useState({});

  const [locales, setLocales] = useState(null);
  const [isLocaleDialogVisible, setLocaleDialogVisible] = useState(false);
  const [isUnitsDialogVisible, setUnitsDialogVisible] = useState(false);
  const [unit, setUnit] = useState(null);
  const [errors, setErrors] = useState({});

  const i18n = translator(editedUser.locale);

  const units = {
    hardness: ['ppm', 'mg', 'µS',  'gH'],
    volume: ['liter', 'm3', 'gallon', 'ounce'],
    length: ['cm', 'm', 'mm', 'in', 'ft'],
    temperature: ['celsius', 'fahrenheit', 'kelvin'],
  }

  useEffect(() => {

    // Get locales data
    Api.getLocales()
      .then(res => {
          setLocales(res.data.locales);
      })
      .catch(err => {
          handleAlert(err);          
      });

  }, []);

  useEffect(()=>{
    if(!helpers.isEmpty(user)){
      seteditedUser(helpers.clone(user)); 
    }
  },[user]);

  async function handleChange(field, value) {
    seteditedUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  }

  async function handleUnitChange(field, value) {
    seteditedUser(prevUser => ({
      ...prevUser,
      units: {
        ...prevUser.units,
        [field]: value
      }
    }));
  }


  function signOut() {
    dispatch(userActions.logout(user));
  };

  function onSubmit(){
    let userData = helpers.clone(editedUser); 

    const validation = validator(userData);

    if (validation !== false) {
      setErrors({
        locale: validation.locale && i18n.t('validation.locale'),
        hardness: validation.hardnessUnits && i18n.t('validation.hardnessUnits'),
        temperature: validation.temperatureUnits && i18n.t('validation.temperatureUnits'),
        length: validation.lengthUnits && i18n.t('validation.lengthUnits'),
        volume: validation.volumeUnits && i18n.t('validation.volumeUnits'),
      });

      dispatch(alertActions.error('user.data.invalid'));

      return;
    }

    dispatch(userActions.updateUser(userData));
  }
   
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
      contentContainerStyle={styles.contentContainerStyle}
    >
      <Background justify="top" style={styles.background}>
        { !helpers.isEmpty(editedUser) && 
          <>
            <Avatar.Image style={styles.image} size={100} source={{uri: editedUser.image}} />
            <Header>
              {helpers.ucFirst(editedUser.name)}
            </Header>

            <View style={styles.container}>
              <View style={styles.row}>
                <Paragraph style={styles.leftSide}>{i18n.t('general.language')}</Paragraph>
                <Paragraph fontWeight='bold' style={styles.centerSide}>{editedUser.locale}</Paragraph>
                <TouchableOpacity style={styles.rightSide}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={theme.colors.lightText}
                    onPress={() => setLocaleDialogVisible(true)}
                  />
                </TouchableOpacity>
              </View>

              <Subheader style={styles.subheader}>{i18n.t('general.measureUnits')}</Subheader>

              <View style={styles.row}>
                <Paragraph style={styles.leftSide}>{i18n.t('general.hardness')}</Paragraph>
                <Paragraph fontWeight='bold' style={styles.centerSide}>{i18n.t('measures.'+editedUser.units.hardness+'Abbr')}</Paragraph>
                <TouchableOpacity style={styles.rightSide}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={theme.colors.lightText}
                    onPress={() => {
                      setUnitsDialogVisible(true);
                      setUnit('hardness')
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Paragraph style={styles.leftSide}>{i18n.t('general.volume')}</Paragraph>
                <Paragraph fontWeight='bold' style={styles.centerSide}>{i18n.t('measures.'+editedUser.units.volume+'Abbr')}</Paragraph>
                <TouchableOpacity style={styles.rightSide}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={theme.colors.lightText}
                    onPress={() => {
                      setUnitsDialogVisible(true);
                      setUnit('volume');
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Paragraph style={styles.leftSide}>{i18n.t('general.length')}</Paragraph>
                <Paragraph fontWeight='bold' style={styles.centerSide}>{i18n.t('measures.'+editedUser.units.length+'Abbr')}</Paragraph>
                <TouchableOpacity style={styles.rightSide}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={theme.colors.lightText}
                    onPress={() => {
                      setUnitsDialogVisible(true);
                      setUnit('length');
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <Paragraph style={styles.leftSide}>{i18n.t('general.temperature')}</Paragraph>
                <Paragraph fontWeight='bold' style={styles.centerSide}>{i18n.t('measures.'+editedUser.units.temperature+'Abbr')}</Paragraph>
                <TouchableOpacity style={styles.rightSide}>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={theme.colors.lightText}
                    onPress={() => {
                      setUnitsDialogVisible(true);
                      setUnit('temperature')
                    }}
                  />
                </TouchableOpacity>
              </View>
              
            </View>

            <Button
              icon="logout-variant"
              onPress={signOut}
              mode="outlined"
              style={styles.logout}
            >
              {i18n.t('general.logout')}
            </Button>
            <Button onPress={onSubmit}>{i18n.t('general.save')}</Button>
          </>
        }
      </Background>


      <Dialog
        isVisible={isLocaleDialogVisible}
        setVisible={() => setLocaleDialogVisible()}
        title={i18n.t('profile.selectLanguage')}
        cancelButton={i18n.t('general.cancel')}
      >
        { locales &&
          <RadioButton.Group
            onValueChange={(value) => {
              handleChange('locale',value);
              setLocaleDialogVisible(false);
            }}
            value={editedUser.locale}
          >
            {
              locales.map(locale => {  
                return (
                  <RadioButton.Item
                    label={helpers.ucFirst(locale.name[editedUser.locale])}
                    value={locale.lang}
                    mode="ios"
                    key={locale._id}
                  />
                )
              })
            }
          </RadioButton.Group>
        }
      </Dialog>

      <Dialog
        isVisible={isUnitsDialogVisible}
        setVisible={() => setUnitsDialogVisible()}
        title={i18n.t('profile.selectMeasureUnit')}
        cancelButton={i18n.t('general.cancel')}
      >
        { !helpers.isEmpty(editedUser) && unit &&
          <RadioButton.Group
            onValueChange={(value) => {
              handleUnitChange(unit,value);
              setUnitsDialogVisible(false);
            }}
            value={editedUser.units[unit]}
          >
            {
              units[unit].map(u => {  
                return (
                  <RadioButton.Item
                    label={helpers.ucFirst(i18n.t('measures.'+u)) + ' (' + i18n.t('measures.'+u+'Abbr') + ")"}
                    value={u}
                    mode="ios"
                    key={u}
                  />
                )
              })
            }
          </RadioButton.Group>
        }
      </Dialog>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingTop: 100,
    flexDirection:'column',
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 0,
  },
  leftSide: {
    flex: 4,
    textAlign: 'left',
  },
  centerSide: {
    flex: 8,
    textAlign: 'left',
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  subheader: {
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  logout: {
    // alignSelf: 'flex-end',
  },
});