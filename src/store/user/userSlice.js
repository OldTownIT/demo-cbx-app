import { createSlice } from '@reduxjs/toolkit';
import Cookies from '../../util/helpers/cookies.js';

const getUserData = () => {
    const cookieUser = Cookies.get('userData');
    return cookieUser ? cookieUser.split(':') : [];
};

const saveUserDataCookie = ({ _id, email, token, roles }) => {
    const userData = '' + 
        _id +   ':' + 
        token + ':' +
        email + ':' +
        roles.join('|');
    Cookies.set('userData', userData);
};

const getTheme = () => {
    const localMode = localStorage.getItem('mode');
    if (localMode) { return localMode; }

    if (self?.matchMedia && self.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
};

const populateUserFromCookies = state => {
    const [userId, token, email, roles] = getUserData();

    if (userId || token || email) {
        state._id = userId || '';
        state.email = email || '';
        state.token = token || '';
        state.roles = roles ? roles?.split('|') : []
    }
}


const initialState = {
    _id: '',
    email: '',
    token: '',
    roles: [],
    mode: getTheme(),
};

populateUserFromCookies(initialState);


export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        changeMode: (state) => { // DEMO -- LIGHT / DARK THEME
            if (state.mode === 'light') {
                state.mode = 'dark';
                localStorage.setItem('mode', 'dark');
            } else {
                state.mode = 'light';
                localStorage.setItem('mode', 'light');
            }
        },
        logOut: (state) => {
            state.token = '';
            state.email = '';
            state._id   = '';
            state.roles = [];
            Cookies.expire('userData');
        },
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            state.email = action.payload.email;
            state._id   = action.payload._id;
            state.roles = action.payload.roles || [];

            saveUserDataCookie(action.payload);
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
    },
});

export const { 
    setCredentials, 
    logOut, 
    setToken, 
    changeMode 
} = userSlice.actions;

export const selectUser = (state) => ({ 
    _id: state.user._id,
    email: state.user.email,
    token: state.user.token,
    roles: state.user.roles,
});

export const selectUserEmail = (state) => state.user.email;
export const selectUserId = (state) => state.user._id;
export const selectToken = (state) => state.user.token;
export const selectMode = (state) => state.user.mode;

export default userSlice.reducer;
