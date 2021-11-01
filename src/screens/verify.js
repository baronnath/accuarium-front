// serc/screens/verify.js

import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { axios }from '../helpers/axios';
import { backend } from '../../app.json';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../theme';
import validator from '../validators/verify';
import { actions as userActions } from '../ducks/user';
import { actions as alertActions } from '../ducks/alert';

const Verify = ({ navigation }) => {
  const [user, setUser] = useState({
        values: {
          code: '',
        },
        errors: {
          code: '',
        }
    });
  const dispatch = useDispatch();
  const email = useSelector(state => state.user.data.email);

  function handleSubmit() {
    const validation = validator(user);
    
    if (validation !== false) {
      setUser(prevUser => ({
        ...prevUser,
        errors: {
          code: validation.code,
        }
      }));

      return;
    }

    const data = {
    	email: email,
    	confirmationToken: user.values.code,
    }

    dispatch(userActions.verify(data));
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

  function resendCode() {
  	axios.get(backend.url + '/user/verify/resend', { params: { email: email }})
	    .then(res => {
	        dispatch(alertActions.success(res.data.message));
	    })
	    .catch(err => {
	        let message;
	        err.response
	            ? message = err.response.data.message
	            : message = 'Server connection error'
	        dispatch(alertActions.error(message));
	    });
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x:0, y:0}}
    >
      <View style={styles.container}>
        <Background>
          <BackButton goBack={() => navigation.navigate('Register')} />

          <Logo />

          <Header>Verify your email</Header>
          <Text>Check yout email inbox for the email verification code</Text>

          <TextInput
            label="Code"
            name="code"
            returnKeyType="next"
            value={user.values.code}
            onChangeText={(code) => handleChange('code', code)}
            error={!!user.errors.code}
            errorText={user.errors.code}
            autoCapitalize="characters"
          />

          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => {resendCode()}}
            >
              <Text style={styles.label}>Resend verification email</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}>
              Verify
          </Button>

        </Background>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
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
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    width: '100%',
  },
});

export default memo(Verify);