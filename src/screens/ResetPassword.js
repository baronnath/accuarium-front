// src/components/ResetPassword.js

import React, { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import * as Localization from 'expo-localization';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';
import TextInput from '../components/TextInput';
import { theme } from '../theme';
import translator from '../translator/translator';
import resetPasswordValidator from '../validators/resetPassword';
import sendResetPasswordValidator from '../validators/sendResetPassword';
import { actions as userActions } from '../ducks/user';

const ResetPassword = ({ route, navigation }) => {
  const dispatch = useDispatch();
  
  const locale = Localization.locale
  const i18n = translator(locale);

  const [user, setUser] = useState({
        values: {
          email: '',
          code: '',
          locale: locale,
        },
        errors: {
          email: '',
          code: '',
        }
    });
  const [code, setCode] = useState(false);

  useEffect(() => {
    if(route.params){
      setCode(route.params.code);
    }
  },[route]);

  function handleSubmit() {
    const validation = code ? resetPasswordValidator(user) : sendResetPasswordValidator(user);

    if (validation !== false) {
      setUser(prevUser => ({
        ...prevUser,
        errors: {
          email: validation.email && i18n.t(validation.email),
          code: validation.code && i18n.t(validation.code),
        }
      }));

      return;
    }

    if(code) {
      const data = {
        email: user.valueemail,
        confirmationToken: user.values.code,
      }
      dispatch(userActions.resetPassword(user.values))
    }
    else {
      dispatch(userActions.sendResetPasswordEmail(user.values))
    }
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

      <Logo />

      <Header>{i18n.t('general.resetPassword')}</Header>

      { code ?
          <>
            <TextInput
              label={i18n.t('general.code')}
              name="code"
              returnKeyType="next"
              value={user.values.code}
              onChangeText={(code) => handleChange('code', code)}
              error={!!user.errors.code}
              errorText={user.errors.code}
              autoCapitalize="characters"
            />
            <TextInput
              label={i18n.t('general.newPassword')}
              name="password"
              returnKeyType="done"
              value={user.values.password}
              onChangeText={(password) => handleChange('password', password)}
              error={!!user.errors.password}
              errorText={user.errors.password}
              secureTextEntry
            />
          </>
        :
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
      }


      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}>
          {i18n.t('general.reset')}
      </Button>

      <View style={styles.row}>
        <Paragraph style={styles.label}>{i18n.t('login.noAccount')} </Paragraph>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Paragraph style={styles.link}>{i18n.t('general.signUp')}</Paragraph>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    flex: 1,
  },  
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    padding: 10,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.accent,
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

export default memo(ResetPassword);