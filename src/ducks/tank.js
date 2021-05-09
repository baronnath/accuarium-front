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
	ADDSPECIES_REQUEST: 'ADDSPECIES_REQUEST',
	ADDSPECIES_SUCCESS: 'ADDSPECIES_SUCCESS',
	ADDSPECIES_ERROR: 'ADDSPECIES_ERROR',
	DELETE_REQUEST: 'DELETE_REQUEST',
	DELETE_SUCCESS: 'DELETE_SUCCESS',
	DELETE_ERROR: 'DELETE_ERROR',
}

// Reducers
export default (state = defaultState, action) => {
	switch(action.type){
    // Request
		case types.GETTANK_REQUEST:
		case types.ADDSPECIES_REQUEST:
		case types.DELETE_REQUEST:
      return { 
          ...state,
          isLoading: true,
      };
    // Error
    case types.GETTANK_ERROR:
    case types.ADDSPECIES_ERROR:
    case types.DELETE_ERROR:
      return {
          ...state,
          isLoading: false,
      };
    // Registration
    case types.GETTANK_SUCCESS:
    case types.ADDSPECIES_SUCCESS:
      return {
          ...state,
          data: action.payload.tanks,
          isLoading: false,
      };
    case types.DELETE_SUCCESS:
    	return {
    		...state,
        data: state.data.filter(tank => action.payload.tanks._id !== tank._id),
        isLoading: false,
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
    addSpecies,
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

function addSpecies(params){
	return dispatch => {
        dispatch(request());

        axios.put(backend.url + '/tank/addspecies', {params: params})
            .then(
                res => { 
                    dispatch(success(res.data));
                		dispatch(alertActions.success(res.data.message));
                }
            ).catch(
                err => {
                		handleAlert(err);
                    dispatch(error());
                }
            );
    };

    function request() { return { type: types.ADDSPECIES_REQUEST } }
    function success(data) { return { type: types.ADDSPECIES_SUCCESS, payload: data } }
    function error() { return { type: types.ADDSPECIES_ERROR } }
}

function _delete(tank) {
  return dispatch => {
      dispatch(request(id));

      axios.delete(backend.url + '/tank', {params: tank})
        .then(
          res => {
        		dispatch(alertActions.success(res.data.message));
            dispatch(success(res.data));
          }
        ).catch(
          err => {
        		handleAlert(err);
            dispatch(error());
          }
        );
  };

  function request() { return { type: types.DELETE_REQUEST } }
  function success(data) { return { type: types.DELETE_SUCCESS, payload: data } }
  function error() { return { type: types.DELETE_ERROR } }
}