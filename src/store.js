// src/store.js

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './ducks/index'; 
import { createLogger } from 'redux-logger';
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
    // Inject token to all axios request
    const user = store.getState().user;
    if(user.data)
    	setHeaders(user.data);
});

export default store;