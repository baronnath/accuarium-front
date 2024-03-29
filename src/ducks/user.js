// components/ducks/user.jsx

// import history from '../history';
// import { initStates } from "../components/helpers/stateLoader/stateLoader"
import * as navigator from '../helpers/navigator.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axios, setHeaders }from '../helpers/axios';
import { backend } from '../../app.json';
import { handleAlert } from '../helpers/global';
import { actions as alertActions } from './alert';


// Types
export const types = {
    GETUSER_REQUEST: 'GETUSER_REQUEST',
    GETUSER_SUCCESS: 'GETUSER_SUCCESS',
    GETUSER_ERROR: 'GETUSER_ERROR',
    UPDATEUSER_REQUEST: 'UPDATEUSER_REQUEST',
    UPDATEUSER_SUCCESS: 'UPDATEUSER_SUCCESS',
    UPDATEUSER_ERROR: 'UPDATEUSER_ERROR',
    REGISTER_REQUEST: 'REGISTER_REQUEST',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_ERROR: 'REGISTER_ERROR',
    VERIFY_REQUEST: 'VERIFY_REQUEST',
    VERIFY_SUCCESS: 'VERIFY_SUCCESS',
    VERIFY_ERROR: 'VERIFY_ERROR',
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_ERROR: 'LOGIN_ERROR',
    AUTOLOGIN_REQUEST: 'AUTOLOGIN_REQUEST',
    AUTOLOGIN_SUCCESS: 'AUTOLOGIN_SUCCESS',
    AUTOLOGIN_ERROR: 'AUTOLOGIN_ERROR',
    LOGOUT_REQUEST: 'LOGOUT_REQUEST',
    LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
    LOGOUT_ERROR: 'LOGOUT_ERROR',
    SENDRESETEMAIL_REQUEST: 'SENDRESETEMAIL_REQUEST',
    SENDRESETEMAIL_SUCCESS: 'SENDRESETEMAIL_SUCCESS',
    SENDRESETEMAIL_ERROR: 'SENDRESETEMAIL_ERROR',
    RESET_REQUEST: 'RESET_REQUEST',
    RESET_SUCCESS: 'RESET_SUCCESS',
    RESET_ERROR: 'RESET_ERROR',
    DELETE_REQUEST: 'DELETE_REQUEST',
    DELETE_SUCCESS: 'DELETE_SUCCESS',
    DELETE_ERROR: 'DELETE_ERROR',
}

// Reducers
export default (state = defaultState, action) => {
    switch(action.type){
        // Request
        case types.GETUSER_REQUEST:
        case types.UPDATEUSER_REQUEST:
        case types.REGISTER_REQUEST:
        case types.VERIFY_REQUEST:
        case types.LOGIN_REQUEST:
        case types.AUTOLOGIN_REQUEST:
        case types.LOGOUT_REQUEST:
        case types.SENDRESETEMAIL_REQUEST:
        case types.RESET_REQUEST:
        case types.DELETE_REQUEST:
            return { 
                ...state,
                isLoading: true,
            };
        // Error
        case types.GETUSER_ERROR:
        case types.UPDATEUSER_ERROR:
        case types.REGISTER_ERROR:
        case types.VERIFY_ERROR:
        case types.LOGIN_ERROR:
        case types.AUTOLOGIN_ERROR:
        case types.LOGOUT_ERROR:
        case types.SENDRESETEMAIL_ERROR:
        case types.RESET_ERROR:
        case types.DELETE_ERROR:
            return {
                ...state,
                isLoading: false,
            }
        // Success 
        case types.GETUSER_SUCCESS:
        case types.UPDATEUSER_SUCCESS:
        case types.REGISTER_SUCCESS:
        case types.VERIFY_SUCCESS:
        case types.LOGIN_SUCCESS:
        case types.AUTOLOGIN_SUCCESS:
        case types.SENDRESETEMAIL_SUCCESS:
        case types.RESET_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: action.payload.user,
            }
        // Logout
        case types.LOGOUT_SUCCESS:
        case types.DELETE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: {
                    accessToken: null,
                }
            }
        default:
            return state
    }
}

const defaultState = {
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
};

// Actions
export const actions = {
    login,
    autoLogin,
    verify,
    logout,
    register,
    getUsers,
    getUser,
    getUserByEmail,
    updateUser,
    sendResetPasswordEmail,
    resetPassword,
    delete: _delete
};

function login(user, from) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user/login', user)
            .then(async(res) => {
                let user = res.data.user;
                user.accessToken = res.data.accessToken;
                dispatch(success(res.data));
                await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
                await setHeaders(user);
                dispatch(alertActions.success(res.data.message, false));
                // navigator.navigate('Home');
            })
            .catch(err => {
                dispatch(error());
                handleAlert(err);
            });
    };

    function request(data) { return { type: types.LOGIN_REQUEST, payload: data } }
    function success(data) { return { type: types.LOGIN_SUCCESS, payload: data } }
    function error(error) { return { type: types.LOGIN_ERROR } }
}

function autoLogin(user) {
    return async dispatch => {
        dispatch(request(user));

        // User must log in at least each 30 days
        if(user){
            const lastUpdate = new Date(user.updatedAt);
            let prev30Days = new Date();
            prev30Days.setDate(prev30Days.getDate() - 29);

            if(lastUpdate >= prev30Days){
                dispatch(success({user: user}));
                await setHeaders(user);
                dispatch(alertActions.success('login.greeting', {name: user.name}));
            }
            else{
                dispatch(alertActions.error('login.expired'));
                dispatch(error());
                navigator.navigate('Login');
            }
        }
        dispatch(error());
    };

    function request(data) { return { type: types.AUTOLOGIN_REQUEST, payload: data } }
    function success(data) { return { type: types.AUTOLOGIN_SUCCESS, payload: data } }
    function error() { return { type: types.AUTOLOGIN_ERROR } }
}

function logout(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user/logout', user)
            .then(async(res) => {
                dispatch(success());
                await AsyncStorage.removeItem('user');
                await setHeaders();
                // dispatch(alertActions.success(res.data.message, false));
            })
            .catch(err => {
                dispatch(error());
                handleAlert(err);
            });
    };
    
    function request() { return { type: types.LOGOUT_REQUEST } }
    function success() { return { type: types.LOGOUT_SUCCESS } }
    function error() { return { type: types.LOGOUT_ERROR } }
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user', user)
            .then(
                res => { 
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message, false));
                    navigator.navigate('Verify');
                }
            ).catch(
                err => {
                    dispatch(error());
                    handleAlert(err);
                }
            );
    };

    function request(data) { return { type: types.REGISTER_REQUEST, payload: data } }
    function success(data) { return { type: types.REGISTER_SUCCESS, payload: data } }
    function error() { return { type: types.REGISTER_ERROR } }
}

function verify(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user/verify', user)
            .then(
                res => { 
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message, false));
                    navigator.navigate('Login');
                }
            ).catch(
                err => {
                    dispatch(error());
                    handleAlert(err);
                }
            );
    };

    function request(data) { return { type: types.VERIFY_REQUEST, payload: data } }
    function success(data) { return { type: types.VERIFY_SUCCESS, payload: data } }
    function error() { return { type: types.VERIFY_ERROR } }
}

function getUsers() {
    return dispatch => {
        dispatch(request());

        userService.getUsers()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: types.GETUSERS_REQUEST } }
    function success(users) { return { type: types.GETUSERS_SUCCESS, users } }
    function failure(error) { return { type: types.GETUSERS_FAILURE, error } }
}

function getUser(id) {
    return _getUser({userId: id});
}

function getUserByEmail(email) {
    return _getUser({email: email});
}

function _getUser(params){
    return dispatch => {
        dispatch(request());

        axios.get(backend.url + '/user', {params: params})
            .then(
                res => { 
                if(params.userId){
                    dispatch(successGetUser(res.data));
                }
                else{
                    dispatch(succesGetUserByEmail(res.data));
                }
                }
            ).catch(
                err => {
                    dispatch(error());
                    handleAlert(err);
                }
            );
    };

    function request() { return { type: types.GETUSER_REQUEST } }
    function successGetUser(data) { return { type: types.GETUSER_SUCCESS, payload: data } }
    function succesGetUserByEmail(data) { return { type: types.GETTUSER_SUCCESS, payload: data } }
    function error() { return { type: types.GETUSER_ERROR } }
}

function updateUser(user){
    return dispatch => {
        dispatch(request());
  
        const params = {
            userId: user._id,
            name: user.name,
            locale: user.locale,
            units: user.units,
        }
  
        axios.put(backend.url + '/user', params)
            .then(
              res => {
                  dispatch(success(res.data));
                  dispatch(alertActions.success(res.data.message, false));
              }
            ).catch(
              err => {
                  dispatch(error());
                  handleAlert(err);
              }
            );
    }

    function request() { return { type: types.UPDATEUSER_REQUEST } }
    function success(data) { return { type: types.UPDATEUSER_SUCCESS, payload: data } }
    function error() { return { type: types.UPDATEUSER_ERROR } }
}

function sendResetPasswordEmail(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user/sendresetpasswordemail', user)
            .then(
                res => { 
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message, false));
                    navigator.navigate('ResetPassword', { code: true });
                }
            ).catch(
                err => {
                    dispatch(error());
                    handleAlert(err);
                }
            );
    };

    function request(data) { return { type: types.SENDRESETEMAIL_REQUEST, payload: data } }
    function success(data) { return { type: types.SENDRESETEMAIL_SUCCESS, payload: data } }
    function error() { return { type: types.SENDRESETEMAIL_ERROR } }
}

function resetPassword(user) {
    return dispatch => {
        dispatch(request(user));

        axios.patch(backend.url + '/user/resetpassword', user)
            .then(
                res => { 
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message, false));
                    navigator.navigate('Login');
                }
            ).catch(
                err => {
                    dispatch(error());
                    handleAlert(err);
                }
            );
    };

    function request(data) { return { type: types.RESET_REQUEST, payload: data } }
    function success(data) { return { type: types.RESET_SUCCESS, payload: data } }
    function error() { return { type: types.RESET_ERROR } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(user) {
    return dispatch => {

        const params = {
            email: user.email,
        }

        axios.delete(backend.url + '/user', {params: params })
            .then(async(res) => {
                dispatch(success());
                await AsyncStorage.removeItem('user');
                await setHeaders();
                dispatch(alertActions.success(res.data.message, false));
            })
            .catch(err => {
                dispatch(error());
                handleAlert(err);
            });
    };

    function request(id) { return { type: types.DELETE_REQUEST, id } }
    function success(id) { return { type: types.DELETE_SUCCESS, id } }
    function error() { return { type: types.DELETE_ERROR } }
}