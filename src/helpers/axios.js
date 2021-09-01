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

export const setHeaders = async (token) => {
	if(!token){
		const user = await AsyncStorage.getItem('user');
		token = user.accessToken;
	}
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export class Api {

	static getTank(id) {
		return this.#getTank({tankId: id});
	}

	static getTankByUser(id) {
		return this.#getTank({userId: id});
	}

	static #getTank(params){
		return axios.get(backend.url + '/tank', {params: params});
	}

	static getSpeciesById(speciesId) {
		let params = {speciesId: speciesId};
		return this.#getSpecies(params);
	}

	static #getSpecies(params) {
		return axios.get(backend.url + '/species', {params: params});
	}

}
