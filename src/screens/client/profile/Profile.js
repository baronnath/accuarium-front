// src/screens/dashboard/profile/Profile.js

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Api }from '../../../helpers/axios';  
import helpers from '../../../helpers/helpers';
import { backend } from '../../../../app.json';
import { StyleSheet, View, Platform, TouchableOpacity} from 'react-native';
import { Portal, Avatar, RadioButton , Dialog } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Background from '../../../components/Background';
import Header from '../../../components/Header';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
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
  const [localeDialog, setLocaleDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const i18n = translator(editedUser.locale);

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


  function signOut() {
    dispatch(userActions.logout(user));
  };

  function onSubmit(){
    let userData = helpers.clone(editedUser); 

    const validation = validator(userData);

    if (validation !== false) {
      setErrors({
        locale: validation.locale && i18n.t('validation.locale'),
        // minTemperature: validation.minTemperature,
        // maxTemperature: validation.maxTemperature,
        // minPh: validation.minPh,
        // maxPh: validation.maxPh,
        // minDh: validvalueation.minDh,
        // maxDh: validation.maxDh,
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
                    onPress={() => setLocaleDialog(true)}
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
      <Portal>
        <Dialog visible={localeDialog} onDismiss={() => setLocaleDialog(false)}>
          <Dialog.Title>{i18n.t('profile.selectLanguage')}</Dialog.Title>
          <Dialog.Content>
            {
              locales &&
              <RadioButton.Group
                onValueChange={(value) => {
                  handleChange('locale',value);
                  setLocaleDialog(false);
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
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setLocaleDialog(false)} mode="outlined">{i18n.t('general.cancel')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  },
  background: {
    paddingTop: 100,
    flex: 1,
    alignSelf: 'stretch',
    flexDirection:'column',
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  row: {
    flex: 1,
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
  logout: {
    // alignSelf: 'flex-end',
  },
});