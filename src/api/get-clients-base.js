import store from '../store/store';
import APIcompose from '../api/__API.js';
import { selectToken } from '../store/user/userSlice.js';
import { NUCLEUS_API } from '../util/constants.js';

const {
    ROOT, 
    CLIENT,
    CLIENT_SETTINGS,
} = NUCLEUS_API;

const urlProd =  ROOT + CLIENT_SETTINGS + CLIENT.ID;

const getClientSettingsBase = () => {

    console.error('getClientSettings');

    const token = selectToken(store.getState());

    return fetch(urlProd, {
        method: 'GET',
        headers: {
            Authorization: 'NC ' + token,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache,no-store'
        }
    });
};
export const API_getClientSettingsBase = 
    APIcompose('API_getClientSettingsBase', getClientSettingsBase);
