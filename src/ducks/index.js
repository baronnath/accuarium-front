// src/ducks/reducers.jsx

import { combineReducers } from 'redux';

import userReducers from './user'; 
import tankReducers from './tank'; 
import alertReducers from './alert';

export default combineReducers({
	user: userReducers,
	alert: alertReducers,
	tanks: tankReducers,
})