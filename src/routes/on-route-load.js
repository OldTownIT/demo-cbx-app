import { selectToken } from '../store/user/userSlice.js';
import { composeMainPageLoad } from '../routes/on-route-main-page.js';
import { sleep } from '../util/helpers/async-helpers.js';

const composeOnRouteLoad = (store) => { 

    const pageLoader = {
        main: composeMainPageLoad(store),
        DEFAULT: async () => { await sleep(1); return { DEFAULT_ROUTE_LOADER: true }; }
    };

    return (name) => async () => {

        const results = await (pageLoader[name] || pageLoader.DEFAULT)();

        results.pageLoaded = name;
        results.loggedIn = Boolean(selectToken(store.getState()));

        return results;
    };

};

export default composeOnRouteLoad;
