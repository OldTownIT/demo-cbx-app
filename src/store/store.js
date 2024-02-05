import { configureStore } from '@reduxjs/toolkit';
import Cookies from '../util/helpers/cookies.js';
import counterReducer from './counter/counterSlice';   // DEMO EXAMPLE
import apiSlice from './api/apiSlice';  // DEMO EXAMPLE

import userReducer from './user/userSlice';
import clientsReducer from './clients/clientSlice';


const store = configureStore({
    reducer: {

        [apiSlice.reducerPath]: apiSlice.reducer,  // DEMO EXAMPLE
        counter: counterReducer,  // DEMO EXAMPLE

        user: userReducer,
        clients: clientsReducer
    },
    middleware: (getdefaultMiddleware) =>
        getdefaultMiddleware().concat(apiSlice.middleware),
    devTools: false,
});

export default store;



const debugStore = () => {
    if (self.DEBUG) {
        self.IX = self.IX || {};

        self.IX.userCookie = () => Cookies.get('userData'); 
        self.IX.store = () => store.getState();
    }    
};

debugStore();
