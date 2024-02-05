import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import composeOnRouteLoad from './on-route-load.js';
import store from '../store/store';
import AppRoot from '../frame/AppRoot.jsx';

import Demo from '../pages/Demo/Demo.jsx';
import Login from '../pages/Login/Login.jsx';
import Main from '../pages/Main/MainPage.jsx';
import NotFound404 from '../pages/NotFound404/NotFound404.jsx';
import AuthRoute from '../auth/AuthRoute.jsx';

const onRouteLoad = composeOnRouteLoad(store);

export const allRoutes = [
    {
        path: '/',
        component: Demo,
        public: true,
    },
    {
        path: 'login',
        component: Login,
        public: true,
        publicOnly: true,
    },
    {
        path: 'logout',
        component: Login,
        navHidden: true,
    },
    {
        path: 'main',
        component: Main,
        public: false,
    },
    {
        label: 'Google!',
        targetURL: 'https://google.com',
        public: true,
        external: true,
    },
    {
        component: NotFound404,
        path: '*',
        public: true,
        navHidden: true,
    },

].map(route => ({ 
    ...route, 
    name: route.path === '*' ? 'not found' : route.path === '/' ? 'demo' : route.path,
    element: AuthRoute(route),
    loader: onRouteLoad(route.path ==='*' ? 'notfound' : route.path)
})
);

const prepRoutesForBrowser = (routeGroup) => routeGroup
    .filter((next) => !next.external)
    .map((next) => ({
        path: next.path,
        element: <next.element />,
        loader: next.loader,
    }));

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppRoot />,
        children: prepRoutesForBrowser(allRoutes),
    },
]);

export default router;
