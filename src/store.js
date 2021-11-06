// src/store.js

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './ducks/index'; 
import { createLogger } from 'redux-logger';
// import userReducers from './ducks/user'; 
// import resourceReducers from './ducks/resource'; 
// import stateLoader from "./components/helpers/stateLoader/stateLoader"
import { setHeaders } from './helpers/axios'

const logger = createLogger();
const store = createStore(
	reducers, 
	applyMiddleware(
		thunk,
		logger
	)
);

store.subscribe(() => {
// 	// Save the state in the localStorage
//     stateLoader.saveState(store.getState());
// 	// console.log('Saved state: ')
//  	// console.log(store.getState());

    // Inject token to all axios request
    const user = store.getState().user;
    if(user.data)
    	setHeaders(user.data);
});

export default store;