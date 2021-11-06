// src/helpers/axios.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { backend } from '../../app.json';

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

export const setHeaders = async (user) => {
	if(!user) {
		user = await AsyncStorage.getItem('user');
	}

	const token = user.accessToken;
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
	axios.defaults.headers.common['Accept-Language'] = user.locale;
}

export class Api {

	// Tank

	static getTank(id) {
		return this._getTank({tankId: id});
	}

	static getTankByUser(id) {
		return this._getTank({userId: id});
	}

	static _getTank(params){
		return axios.get(backend.url + '/tank', {params: params});
	}


	// Species

	static getSpeciesById(speciesId) {
		let params = {speciesId: speciesId};
		return this._getSpecies(params);
	}

	static _getSpecies(params) {
		return axios.get(backend.url + '/species', {params: params});
	}


	// Locale

	static getLocales(params) {
		return axios.get(backend.url + '/locales');
	}

}
