const logCSS = 'color: rgb(240, 80, 0); font-weight: 600';

export const DataDog = (() => {
    const logToConsole = (name, data, level) => {
        if (self.DEBUG) {
            console.groupCollapsed(
                '%cAPI ERROR - SENT TO DATA DOG: ' +
                    name +
                    ' | level: ' +
                    level,
                logCSS,
            );
            for (const [key, val] of Object.entries(data)) {
                console.log(key + ':', val);
            }
            console.groupEnd();
        }
    };

    const clientToken = 'pubxxxxx'; // Public token from your DataDog accoun
    let Log = {
        log: () => {
            /* no op -- this will be replaced by the "real" DataDog logger */
        },
    };

    const logContext = {};
    let isLogActive = false;

    const initialize = () => {
        const DD_LOGS = self.DD_LOGS;

        if (!DD_LOGS) {
            if (self.DEBUG) {
                console.error('DataDog Not Found');
            }
            return;
        }

        logContext.client = 'TBD -- who is the customer?';

        DD_LOGS.init({
            clientToken: clientToken,
            forwardErrorsToLogs: true,
        });

        DD_LOGS.createLogger('MAIN_LOGGER', {
            level: 'debug', // minimum level that this logger will log
            handler: 'http',
            logContext,
        });

        DD_LOGS.setLoggerGlobalContext(logContext);

        Log = DD_LOGS.getLogger('MAIN_LOGGER');

        isLogActive = true;
    };

    initialize();

    const send = (name, data, messageLevel) => {
        const level = messageLevel || 'error';
        Log.log(name, data, level);
        logToConsole(name, { ...logContext, ...data }, level);
    };

    const addContext = (field, value) => {
        logContext[field] = value;

        if (
            isLogActive &&
            self.DD_LOGS &&
            self.DD_LOGS.addLoggerGlobalContext
        ) {
            self.DD_LOGS.addLoggerGlobalContext(field, value);
        }
    };

    return {
        send,
        addContext,
    };
})();

export const trackAPIError = (() => {
    const REPORT = {
        UNKOWN: (response, routeName, json, args) => {
            if (self.DEBUG) {
                console.group('%cTRACKER ERROR: UNKNOWN API CALL', logCSS);
                console.log('routeName', routeName);
                console.log(
                    'add "' +
                        routeName +
                        '" to the list in /utils/track-ops-shared.js',
                );
                console.log('args', args);
                console.log('response', response);
                console.groupEnd();
            }

            defaultTracker(
                'UNKNOWN API CALL: ' + routeName,
                response,
                json,
                args,
            );
        },

        FULL: (response, routeName, json, args) => {
            if (self.DEBUG) {
                console.groupCollapsed('%cTRACKER ERROR:', logCSS, routeName);
                console.log('args', args);
                console.log('response', response);
                console.groupEnd();
            }
        },
    };

    const normalizeData = (collector, field, source) => {
        if (source === null) {
            return;
        }

        if (typeof source === 'number' || typeof source === 'string') {
            collector[field] = source;
        }

        if (Array.isArray(source)) {
            for (let i = 0; i < source.length; i++) {
                normalizeData(collector, field + '_' + i, source[i]);
            }
        }

        if (typeof source === 'object') {
            for (const [key, value] of Object.entries(source)) {
                normalizeData(collector, field + '_' + key, value);
            }
        }
    };

    const defaultTracker = (routeName, response, json, args) => {
        if (response.status !== 200 && response.status !== 201) {
            const data = {
                event_type: routeName,
                response_status: response.status || response,
                response_request_url: response.url || '--NONE--',
                response_headers: response.headers
                    ? JSON.stringify(response.headers)
                    : '--NONE--',
                response_body: json || '---- NO RESPONSE BODY ----',
            };

            normalizeData(data, 'args', args);
            DataDog.send(name, data);
        }
    };

    const track = {
        API_dummyRoute: (response, json, args) =>
            defaultTracker('API_dummyRoute', response, json, args[0]),
    };

    return (response, routeName, json, args) => {
        if (track[routeName]) {
            track[routeName](response, json, args);
        } else {
            REPORT.UNKOWN(response, routeName, json, args, defaultTracker);
        }

        // EXAMPLE:
        // if (routeName === 'API_wantToDebugThis') {
        //     REPORT.FULL(response, routeName, json, args); }
    };
})();
