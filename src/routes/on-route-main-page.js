import { API_getClientSettingsBase } from '../api/get-clients-base.js';
import { setBase, selectClientBase } from '../store/clients/clientSlice.js';
import { sleep } from '../util/helpers/async-helpers.js';

export const trackClientBase = {
    clientBaseRequested: 0,
    clientBaseArrived: 0,
}

const getClient = async (store) => {
    const results = await API_getClientSettingsBase();
    console.error("GOT CLIENT", results);
    trackClientBase.clientBaseArrived = Date.now();
    store.dispatch(setBase(results.json));
};

export const composeMainPageLoad = (store) => async () => {
    const clientBase = selectClientBase(store.getState());

    if (!clientBase?._id && !trackClientBase.clientBaseRequested) {
        trackClientBase.clientBaseRequested = Date.now();
        getClient(store);
    }

    await sleep(1);
    return {
        clientBaseRequested: trackClientBase.clientBaseRequested,
        clientBaseArrived: trackClientBase.clientBaseArrived,
    };
};
