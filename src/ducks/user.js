// components/ducks/user.jsx

// import history from '../history';
// import { initStates } from "../components/helpers/stateLoader/stateLoader"
import * as navigator from '../helpers/navigator.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axios, setHeaders }from '../helpers/axios';
import { backend } from '../../app.json';
import { actions as alertActions } from './alert';


// Types
export const types = {
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
}

// Reducers
export default (state = defaultState, action) => {
	switch(action.type){
        // Request
		case types.REGISTER_REQUEST:
        case types.VERIFY_REQUEST:
        case types.LOGIN_REQUEST:
        case types.AUTOLOGIN_REQUEST:
        case types.LOGOUT_REQUEST:
            return { 
                ...state,
                isLoading: true,
            };
        // Error
        case types.REGISTER_ERROR:
        case types.VERIFY_ERROR:
        case types.LOGIN_ERROR:
        case types.AUTOLOGIN_ERROR:
        case types.LOGOUT_ERROR:
            return {
                ...state,
                isLoading: false,
            };
        // Registration
        case types.REGISTER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: action.payload.user,
            };
        // Verification
        case types.VERIFY_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: action.payload.user,
            };
        // Login
        case types.LOGIN_SUCCESS:
        case types.AUTOLOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: action.payload.user,
            }
        // Logout
        case types.LOGOUT_SUCCESS:
            return {};
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
    getAll,
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
                await setHeaders();
                dispatch(alertActions.success(res.data.message));
                // navigator.navigate('Home');
            })
            .catch(err => {
                let message;
                err.response
                    ? message = err.response.data.message
                    : message = 'Server connection error'
                dispatch(error(message));
                dispatch(alertActions.error(message));
            });
    };

    function request(data) { return { type: types.LOGIN_REQUEST, payload: data } }
    function success(data) { return { type: types.LOGIN_SUCCESS, payload: data } }
    function error(error) { return { type: types.LOGIN_ERROR, error } }
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
                await setHeaders();
                dispatch(alertActions.success('Nice to see you again, ' + user.name));
            }
            else{
                let message = 'Your session has expired. Please log in';
                dispatch(error(message));
                dispatch(alertActions.error(message));
            }
        }
    };

    function request(data) { return { type: types.AUTOLOGIN_REQUEST, payload: data } }
    function success(data) { return { type: types.AUTOLOGIN_SUCCESS, payload: data } }
    function error(error) { return { type: types.AUTOLOGIN_ERROR, error } }
}

function logout(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user/logout', user)
            .then(async(res) => {
                dispatch(success());
                await AsyncStorage.removeItem('user', JSON.stringify(res.data.user));
                dispatch(alertActions.success(res.data.message));
                navigator.navigate('Home');
            })
            .catch(err => {
                let message;
                err.response
                    ? message = err.response.data.message
                    : message = 'Server connection error'
                dispatch(error(message));
                dispatch(alertActions.error(message));
            });
    };
    
    function request() { return { type: types.LOGOUT_REQUEST } }
    function success() { return { type: types.LOGOUT_SUCCESS } }
    function error(error) { return { type: types.LOGOUT_ERROR, error } }
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user', user)
            .then(
                res => { 
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message));
                    navigator.navigate('Verify');
                }
            ).catch(
                err => {
                    let message;
                    err.response
                        ? message = err.response.data.message
                        : message = 'Server connection error'
                    dispatch(error(message));
                    dispatch(alertActions.error(message));
                }
            );
    };

    function request(data) { return { type: types.REGISTER_REQUEST, payload: data } }
    function success(data) { return { type: types.REGISTER_SUCCESS, payload: data } }
    function error(error) { return { type: types.REGISTER_ERROR, error } }
}

function verify(user) {
    return dispatch => {
        dispatch(request(user));

        axios.post(backend.url + '/user/verify', user)
            .then(
                res => { 
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message));
                    navigator.navigate('Login');
                }
            ).catch(
                err => {
                    let message;
                    err.response
                        ? message = err.response.data.message
                        : message = 'Server connection error'
                    dispatch(error(message));
                    dispatch(alertActions.error(message));
                }
            );
    };

    function request(data) { return { type: types.VERIFY_REQUEST, payload: data } }
    function success(data) { return { type: types.VERIFY_SUCCESS, payload: data } }
    function error(error) { return { type: types.VERIFY_ERROR, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: types.GETALL_REQUEST } }
    function success(users) { return { type: types.GETALL_SUCCESS, users } }
    function failure(error) { return { type: types.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: types.DELETE_REQUEST, id } }
    function success(id) { return { type: types.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: types.DELETE_FAILURE, id, error } }
}