// src/ducks/alert.js

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
                type: 'success',
                message: action.message,
                visible: true
            };
        case types.ALERT_ERROR:
            return {
                type: 'error',
                message: action.message,
                visible: true
            };
        case types.ALERT_CLEAR:
            return {
                type: 'success',
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

function success(message) {
    return { type: types.ALERT_SUCCESS, message };
}

function error(message) {
    return { type: types.ALERT_ERROR, message };
}

function clear() {
    return { type: types.ALERT_CLEAR };
}