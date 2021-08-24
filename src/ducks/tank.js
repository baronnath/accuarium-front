// components/ducks/tank.jsx

import * as navigator from '../helpers/navigator.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axios, setHeaders }from '../helpers/axios';
import { backend } from '../../app.json';
import { handleAlert } from '../helpers/global';
import { calculateVolume } from '../helpers/tank';
import { actions as alertActions } from './alert';

// Types
export const types = {
	GETTANK_REQUEST: 'GETTANK_REQUEST',
	GETTANK_SUCCESS: 'GETTANK_SUCCESS',
	GETTANK_ERROR: 'GETTANK_ERROR',
  UPDATETANK_REQUEST: 'UPDDATETANK_REQUEST',
  UPDATETANK_SUCCESS: 'UPDATETANK_SUCCESS',
  UPDATETANK_ERROR: 'UPDATETANK_ERROR',
	ADDSPECIES_REQUEST: 'ADDSPECIES_REQUEST',
	ADDSPECIES_SUCCESS: 'ADDSPECIES_SUCCESS',
	ADDSPECIES_ERROR: 'ADDSPECIES_ERROR',
	DELETE_REQUEST: 'DELETE_REQUEST',
	DELETE_SUCCESS: 'DELETE_SUCCESS',
	DELETE_ERROR: 'DELETE_ERROR',
  GETCOMPATIBILITY_REQUEST: 'GETCOMPATIBILITY_REQUEST',
	GETCOMPATIBILITY_SUCCESS: 'GETCOMPATIBILITY_SUCCESS',
	GETCOMPATIBILITY_ERROR: 'GETCOMPATIBILITY_ERROR',
}

// Reducers
export default (state = defaultState, action) => {
  let index;
  let data;
  
	switch(action.type){
    // Request
    case types.GETTANK_REQUEST:
		case types.UPDATETANK_REQUEST:
		case types.ADDSPECIES_REQUEST:
		case types.DELETE_REQUEST:
    case types.GETCOMPATIBILITY_REQUEST:
      return { 
          ...state,
          isLoading: true,
      };
    // Error
    case types.GETTANK_ERROR:
    case types.UPDATETANK_ERROR:
    case types.ADDSPECIES_ERROR:
    case types.DELETE_ERROR:
    case types.GETCOMPATIBILITY_ERROR:
      return {
          ...state,
          isLoading: false,
      };
    case types.GETTANK_SUCCESS:
    case types.UPDATETANK_SUCCESS:
      
      return {
          ...state,
          data: action.payload.tanks.length ? action.payload.tanks : [action.payload.tanks], // array type needed
          isLoading: false,
      };
    // Find modified tank in state and update only the affected tank
    case types.ADDSPECIES_SUCCESS:
    	index = state.data.findIndex(tank => action.payload.tank._id === tank._id);
    	data = [...state.data];
    	data[index] = action.payload.tank;
    	return {
    		...state,
    		data: data,
        isLoading: false,
    	};
    case types.DELETE_SUCCESS:
     filtered = state.data.filter(tank => action.payload.tanks._id !== tank._id);
    	return {
    		...state,
        data: filtered,
        isLoading: false,
    	};
    case types.GETCOMPATIBILITY_SUCCESS:
      index = state.data.findIndex(tank => action.payload.tankId === tank._id);
    	data = [...state.data];
    	data[index]['compatibility'] = action.payload.data.compatibility;
    	return {
    		...state,
    		data: data,
        isLoading: false,
    	};
    default:
			return state
	}
}

const defaultState = {
	isLoading: true,
	data: [],
};

// Actions
export const actions = {
    getTank,
    getTankByUser,
    getTanksByUser: getTankByUser,
    updateTank,
    addSpecies,
    delete: _delete,
    getCompatibility,
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
                dispatch(error());
            		handleAlert(err);
            }
        );
    };

    function request() { return { type: types.GETTANK_REQUEST } }
    function success(data) { return { type: types.GETTANK_SUCCESS, payload: data } }
    function error() { return { type: types.GETTANK_ERROR } }
}

function updateTank(tank){
  return dispatch => {
        dispatch(request());

        const params = {
          tankId: tank._id,
          name: tank.name,
          length: tank.measures.length,
          width: tank.measures.width,
          height: tank.measures.height,
          liters: tank.liters,
          species: tank.species,
        }

        axios.put(backend.url + '/tank', params)
            .then(
                res => {
                    // navigator.navigate('Tanks');
                    dispatch(success(res.data));
                    dispatch(alertActions.success(res.data.message));
                }
            ).catch(
                err => {
                    dispatch(error());
                    handleAlert(err);
                }
            );
    };

    function request() { return { type: types.UPDATETANK_REQUEST } }
    function success(data) { return { type: types.UPDATETANK_SUCCESS, payload: data } }
    function error() { return { type: types.UPDATETANK_ERROR } }
}

function addSpecies(params){
	return dispatch => {
        dispatch(request());

        axios.put(backend.url + '/tank/addspecies', params)
            .then(
                res => { 
                    dispatch(success(res.data));
                		dispatch(alertActions.success(res.data.message));
                }
            ).catch(
                err => {
                    dispatch(error());
                		handleAlert(err);
                }
            );
    };

    function request() { return { type: types.ADDSPECIES_REQUEST } }
    function success(data) { return { type: types.ADDSPECIES_SUCCESS, payload: data } }
    function error() { return { type: types.ADDSPECIES_ERROR } }
}

function _delete(tankId) {
  return dispatch => {
      dispatch(request());
      const route = navigator.route();

      axios.delete(backend.url + '/tank', {params: {tankId: tankId}})
        .then(
          res => {
            if(route.name == 'Tank')
              navigator.navigate('Tanks');
            dispatch(success(res.data));
        		dispatch(alertActions.success(res.data.message));
          }
        ).catch(
          err => {
            dispatch(error());
        		handleAlert(err);
          }
        );
  };

  function request() { return { type: types.DELETE_REQUEST } }
  function success(data) { return { type: types.DELETE_SUCCESS, payload: data } }
  function error() { return { type: types.DELETE_ERROR } }
}

function getCompatibility(tankId){
	return dispatch => {
        dispatch(request());

        axios.get(backend.url + '/compatibility', { params: { tankId: tankId } })
            .then(
                res => {
                    dispatch(success({ data: res.data, tankId }));
                }
            ).catch(
                err => {
                    dispatch(error());
                		handleAlert(err);
                }
            );
    };

    function request() { return { type: types.GETCOMPATIBILITY_REQUEST } }
    function success(data) { return { type: types.GETCOMPATIBILITY_SUCCESS, payload: data } }
    function error() { return { type: types.GETCOMPATIBILITY_ERROR } }
}