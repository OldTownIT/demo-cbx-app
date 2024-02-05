import store from '../store/store';
import { Navigate } from 'react-router-dom';
import {
    LOGGED_IN_LANDING_URL,
    PUBLIC_LANDING_URL
} from '../util/constants.js';
import { selectToken } from '../store/user/userSlice.js';

// eslint-disable-next-line react/display-name
const AuthRoute = (route) => (props) => {

    const Component = route.element || route.component;
    const publicRoute = route.element /* bypass AuthRoute */ || route.public;
    const loggedIn = Boolean(selectToken(store.getState()));

    // console.log('Auth:', route.path, '[', 
    //     (route.public ? 'public' : 'secure'),
    //     (loggedIn ? 'logged': ' NOT'), 
    //     ']', props);

    if (loggedIn && route.path === 'logout') {
        return <Component {...props} />;
    }

    if (loggedIn && route.publicOnly) {
        return <Navigate to={LOGGED_IN_LANDING_URL} />;
    }

    if (publicRoute) {
        return <Component {...props} />;
    }


    if (!loggedIn) {
        return <Navigate to={PUBLIC_LANDING_URL} />;
    }

    return <Component {...props} />;
};

export default AuthRoute;
