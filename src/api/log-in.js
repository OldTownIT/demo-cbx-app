import APIcompose from './__API.js';
import { NUCLEUS_API } from '../util/constants.js';

const {
    ROOT, CLIENT, LOGIN
} = NUCLEUS_API;

const urlProd =  ROOT + LOGIN + '?client_id=' + CLIENT.ID;

const logIn = (email, password) => {
    return fetch(urlProd, {
        method: 'GET',
        headers: {
            Authorization: 'Basic ' + btoa(email + ':' + password),
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache,no-store'
        }
    });
};
export const API_logIn = APIcompose('API_logIn', logIn);
