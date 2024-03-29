// src/ducks/alert.js
import translator from '../translator/translator';


// Types
export const types = {
    ALERT_SUCCESS: 'ALERT_SUCCESS',
    ALERT_ERROR: 'ALERT_ERROR',
    ALERT_CLEAR: 'ALERT_CLEAR'
};

// Reducers
export default (state = {}, action) => {
    switch (action.type) {
        case types.ALERT_SUCCESS:
            return {
                ...state,
                type: 'success',
                message: action.message,
                visible: true
            };
        case types.ALERT_ERROR:
            return {
                ...state,
                type: 'error',
                message: action.message,
                visible: true
            };
        case types.ALERT_CLEAR:
            return {
                ...state,
                type: '',
                message: '',
                visible: false
            };
        default:
            return state
    }
}

// Actions
export const actions = {
    success,
    error,
    clear
};

function success(message, translate = 'true') {
      return { type: types.ALERT_SUCCESS, message: translate ? _translate(message, translate) : message };
}

function error(message, translate = 'true') {
    return { type: types.ALERT_ERROR,  message: translate ? _translate(message, translate) : message };
}

function clear() {
    return { type: types.ALERT_CLEAR };
}

function _translate(message, params) {
    const i18n = translator();
    return i18n.t(message, params);
}