import { createSlice } from '@reduxjs/toolkit';
import { trackClientBase } from '../../routes/on-route-main-page.js';

const initialState = {
    base: [],
    details: [],
};

export const clientSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut: (state) => {
            state.base = [];
            state.details = [];

            trackClientBase.clientBaseRequested = 0;
            trackClientBase.clientBaseArrived = 0;

        },
        setBase: (state, action) => {
            state.base = action.payload
        },
    },
});

export const {
    setBase,
    logOut: logOutClients
} = clientSlice.actions;

export const selectClientBase = (state) => state.clients.base;

export default clientSlice.reducer;
