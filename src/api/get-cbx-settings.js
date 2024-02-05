import { CBX_SETTINGS_URL, CBX_SETTINGS_ENV } from '../util/constants.js';
import { sleep } from '../util/helpers/async-helpers.js';
import Cookies from '../util/helpers/cookies.js';
import APIcompose from './__API.js';

const PROD = CBX_SETTINGS_ENV === 'PRODUCTION';

const buildHeaders = (() => {
    const base = {
        'Content-Type': 'application/json',
    };

    const production = {
        'Cache-Control': 'no-cache,no-store'        
    };

    return () => {
        if (PROD) {
            return { ...base, ...production };
        }

        return { ...base };
    }

})();

const shouldUseLocal = self.DEBUG 
    ? () => {
        const mode = Cookies.get('cbxSettingsMode');
        return (mode === 'LOCAL');
      }
    : () => false;

const getLocalCbxSettings = async () => {
    await sleep(1);
    const settings = localStorage.getItem('cbxSettings') || '{"cbx_settings":[]}';
    return { json: JSON.parse(settings) }; 
};


const getCbxSettings = (cbxPartnerID) => {

    if (shouldUseLocal()) {
        return getLocalCbxSettings();
    }

    console.log('getCbxSettings HREF', window.location.href);

    const url =  CBX_SETTINGS_URL + (cbxPartnerID ? '?partner=' + cbxPartnerID : '');

    const method = PROD ? 'POST' : 'GET';



    return fetch(url, {
        method,
        headers: buildHeaders(),
        BODY: JSON.stringify({
            href: window.location.href
        })
    });
};

export const API_getCbxSettings = APIcompose('API_getCbxSettings', getCbxSettings);
