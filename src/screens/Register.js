// src/screens/register.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Localization from 'expo-localization';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../theme';
import translator from '../translator/translator';
import validator from '../validators/register';
import { actions as userActions } from '../ducks/user';

function Register ({ navigation }) {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);

  const locale = Localization.locale
  const i18n = translator(locale);

  const [user, setUser] = useState({
        values: {
          name: '',
          email: '',
          password: '',
        },
        errors: {
          name: '',
          email: '',
          password: '',
        }
    });
  
  function handleSubmit() {
    const validation = validator(user);

    if (validation !== false) {
      setUser(prevUser => ({
        ...prevUser,
        errors: {
          name: validation.name && i18n.t(validation.name),
          email: validation.email && i18n.t(validation.email),
          password: validation.password && i18n.t(validation.password)
        }
      }));

      return;
    }

    dispatch(userActions.register(user.values));
  };

  function handleChange(field, value) {
    setUser(prevUser => ({
      ...prevUser,
      values: { 
        ...prevUser.values,
        [field]: value
      }
    }));
  }

  return (
    <Background style={styles.container} justify="top">
      <BackButton goBack={() => navigation.navigate('Login')} />

      <Logo />

      <Header>{i18n.t('general.register')}</Header>


      <TextInput
        label={i18n.t('general.name')}
        name="name"
        returnKeyType="next"
        value={user.values.name}
        onChangeText={(name) => handleChange('name', name)}
        error={!!user.errors.name}
        errorText={user.errors.name}
      />

      <TextInput
        label={i18n.t('general.email')}
        name="email"
        returnKeyType="next"
        value={user.values.email}
        onChangeText={(email) => handleChange('email', email)}
        error={!!user.errors.email}
        errorText={user.errors.email}
        autoCapitalize="none"
        autofill="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label={i18n.t('general.password')}
        name="password"
        returnKeyType="done"
        value={user.values.password}
        onChangeText={(password) => handleChange('password', password)}
        error={!!user.errors.password}
        errorText={user.errors.password}
        secureTextEntry
        onSubmitEditing={handleSubmit}
      />
        

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        disabled={isLoading}
      >
          {i18n.t('general.signUp')}
      </Button>

      <View style={styles.row}>
        <Paragraph style={styles.label}>{i18n.t('register.haveAccount')} </Paragraph>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Paragraph style={styles.link}>{i18n.t('general.login')}</Paragraph>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  }, 
  label: {
    color: theme.colors.text,
    padding: 10,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(Register);