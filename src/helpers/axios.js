// src/helpers/axios.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const ax = require('axios');
// const http	= require('http');
// const https = require('https');

export const axios = ax.create({
	timeout: 60000, // 60sec

	// Keep alive pools and reuses TCP connections so it's faster
	// httpAgget: new http.Agent({ keepAlive: true}),
	// httpsAgget: new https.Agent({ keepAlive: true}),

	// Maximun content lenght up to 50MBs, just in case
	maxContentLenght: 50 * 1000 * 1000
})

export const setHeaders = async (token) => {
	if(!token){
		const user = await AsyncStorage.getItem('user');
		token = user.accessToken;
	}
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
