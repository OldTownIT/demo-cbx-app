import { trackAPIError } from './__log-track.js';

const responseIsGood = (() => {
    const good = {
        200: true,
        201: true,
        202: true,
        203: true,
        204: true, // PATCH success, no json body
    };

    const ok = {
        V2_addPage_API: {
            409: true,
        },
        V2_GetView_API: {
            406: true,
        },
    };

    return (status, name) => {
        if (good[status]) {
            return true;
        }

        if (ok[name] && ok[name][status]) {
            return true;
        }

        return false;
    };
})();

const getJson = (() => {
    const specials = {
        API_exampleNonResponseRoute: true,
    };

    const specialCase = (response, name) => Boolean(specials[name]);

    return async (response, name) => {
        if (specialCase(response, name)) {
            return true;
        }

        if (response.status === 204) {
            // PATCH 204 RESPONSES HAVE NO JSON BODY
            return true;
        }

        try {
            return await response.json();
        } catch {
            return false;
        }
    };
})();

const APIcompose = (name, method) => {
    return async (...args) => {
        // if (self.DEBUG && name === 'API_getGlossaryTerms') { console.log('handleRequest', name, args); }

        try {
            const response = await method(...args);
            const json = await getJson(response, name);

            if (!responseIsGood(response.status, name)) {
                trackAPIError(response, name, json, args);

                return {
                    status: response.status,
                    json: false,
                };
            }

            return {
                status: response.status,
                json,
            };
        } catch (e) {
            trackAPIError(String(e), name, 'NO_BODY', args);

            return {
                status: 'ERROR',
                json: e,
            };
        }
    };
};

export default APIcompose;
