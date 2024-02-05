import Cookies from '../util/helpers/cookies.js';

if (self.DEBUG) { 
    window.I.userCookie = () => { 
        console.log('userData:',Cookies.get('userData')); 
        console.log('userRoles:', Cookies.get('userRoles')); 
    };
}

let store =() => false;

export const initAuth = upstreamStore => {
    store = upstreamStore;

    const userData = Cookies.get('userData');

     const [userId, token, email] = getUserData();

    if (userId || token || email) {
        store

    }
};


const getUserData = () => {

    if (self.DEBUG) { window.I.userCookie = () => { 
        console.log('userData:', Cookies.get('userData')); 
        console.log('userRoles:', Cookies.get('userRoles')); 
    }; }

    const cookieUser = Cookies.get('userData');

    return cookieUser ? cookieUser.split(':') : [];
};

