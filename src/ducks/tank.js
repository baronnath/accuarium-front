// components/ducks/tank.jsx

import * as navigator from '../helpers/navigator.js';
import AsyncStorage from '@react-native-community/async-storage';
import { axios, setHeaders }from '../helpers/axios';
import { backend } from '../../app.json';
import { handleAlert, calculateVolume } from '../helpers/global';
import { actions as alertActions } from './alert';

// Types
export const types = {
	GETTANK_REQUEST: 'GETTANK_REQUEST',
	GETTANK_SUCCESS: 'GETTANK_SUCCESS',
	GETTANK_ERROR: 'GETTANK_ERROR',
}

// Reducers
export default (state = defaultState, action) => {
	switch(action.type){
    // Request
		case types.GETTANK_REQUEST:
      return { 
          ...state,
          isLoading: true,
      };
    // Error
    case types.GETTANK_ERROR:
      return {
          ...state,
          isLoading: false,
      };
    // Registration
    case types.GETTANK_SUCCESS:
      return {
          ...state,
          isLoading: false,
          data: action.payload.tanks,
      };
    default:
			return state
	}
}

const defaultState = {
	isLoading: true,
};

// Actions
export const actions = {
    getTank,
    getTankByUser,
    getTanksByUser: getTankByUser,
    delete: _delete
};	

function getTank(id) {
		return _getTank({tankId: id});
}

function getTankByUser(id) {
		return _getTank({userId: id});
}

function _getTank(params){
	return dispatch => {
        dispatch(request());

        axios.get(backend.url + '/tank', {params: params})
            .then(
                res => { 
                    dispatch(success(res.data));
                }
            ).catch(
                err => {
                		handleAlert(err);
                    dispatch(error());
                }
            );
    };

    function request() { return { type: types.GETTANK_REQUEST } }
    function success(data) { return { type: types.GETTANK_SUCCESS, payload: data } }
    function error() { return { type: types.GETTANK_ERROR } }
}

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