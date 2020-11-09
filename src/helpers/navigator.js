// src/helpers/navigator.js

/* 
// How to use
// (use navigation outside components
// when no access to navigation props)

	// any js module
	import * as RootNavigation from './path/to/navigator.js';

	// ...

	RootNavigation.navigate('ChatScreen', { userName: 'Lucy' });
*/

import React from 'react';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}



