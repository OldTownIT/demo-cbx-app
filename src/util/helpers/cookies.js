/*
* Cookies.js - 1.2.2
* https://github.com/ScottHamper/Cookies
* This is free and unencumbered software released into the public domain.
*/

var factory = function (window) {
    if (typeof window.document !== 'object') {
        throw new Error('Cookies.js requires a `window` with a `document` object');
    }

    var Cookies = function (key, value, options) {
        return arguments.length === 1 ?
            Cookies.get(key) : Cookies.set(key, value, options);
    };

    // Allows for setter injection in unit tests
    Cookies._document = window.document;

    // Used to ensure cookie keys do not collide with
    // built-in `Object` properties
    Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
    
    Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

    Cookies.defaults = {
        path: '/',
        secure: true,
        samesite: 'strict'
    };

    Cookies.get = function (key) {
        if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
            Cookies._renewCache();
        }
        
        var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

        return value === undefined ? undefined : decodeURIComponent(value);
    };

    Cookies.set = function (key, value, propOptions) {
        const options = Cookies._getExtendedOptions(propOptions);
        options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

        Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

        return Cookies;
    };

    Cookies.expire = function (key, options) {
        return Cookies.set(key, undefined, options);
    };

    Cookies._getExtendedOptions = function (options) {
        return {
            path: options && options.path || Cookies.defaults.path,
            domain: options && options.domain || Cookies.defaults.domain,
            expires: options && options.expires || Cookies.defaults.expires,
            secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure,
            samesite: options && options.samesite !== undefined ? options.samesite: Cookies.defaults.samesite
        };
    };

    Cookies._isValidDate = function (date) {
        return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
    };

    Cookies._getExpiresDate = function (propExpires, workingDate) {
        let expires = propExpires;
        const now = workingDate || new Date();

        if (typeof expires === 'number') {
            expires = expires === Infinity ?
                Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
        } else if (typeof expires === 'string') {
            expires = new Date(expires);
        }

        if (expires && !Cookies._isValidDate(expires)) {
            throw new Error('`expires` parameter cannot be converted to a valid Date instance');
        }

        return expires;
    };

    Cookies._generateCookieString = function (propKey, propValue, propOptions) {
        // eslint-disable-next-line no-useless-escape
        let key = propKey.replace(/[^#$&+\^`|]/g, encodeURIComponent);
        key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
        // eslint-disable-next-line no-useless-escape
        const value = String(propValue || '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
        const options = propOptions || {};

        let cookieString = key + '=' + value;
        cookieString += options.path ? ';path=' + options.path : '';
        cookieString += options.domain ? ';domain=' + options.domain : '';
        cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
        cookieString += options.secure ? ';secure' : '';
        cookieString += options.samesite 
            ? options.samesite === 'None'
                ? ';SameSite=None'
                : ';samesite' 
            : '';

        return cookieString;
    };

    Cookies._getCacheFromString = function (documentCookie) {
        var cookieCache = {};
        var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

        for (var i = 0; i < cookiesArray.length; i++) {
            var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

            if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
            }
        }

        return cookieCache;
    };

    Cookies._getKeyValuePairFromCookieString = function (cookieString) {
        // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
        var separatorIndex = cookieString.indexOf('=');

        // IE omits the "=" when the cookie value is an empty string
        separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

        var key = cookieString.substr(0, separatorIndex);
        var decodedKey;
        try {
            decodedKey = decodeURIComponent(key);
        } catch (e) {
            if (console && typeof console.error === 'function') {
                console.error('Could not decode cookie with key "' + key + '"', e);
            }
        }
        
        return {
            key: decodedKey,
            value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
        };
    };

    Cookies._renewCache = function () {
        Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
        Cookies._cachedDocumentCookie = Cookies._document.cookie;
    };

    Cookies._areEnabled = function () {
        var testKey = 'cookies.js';
        var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
        Cookies.expire(testKey);
        return areEnabled;
    };

    Cookies.enabled = Cookies._areEnabled();

    return Cookies;
};

var Cookies = factory(window);

export default Cookies;
