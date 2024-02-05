import React from 'react';
import { useSelector } from 'react-redux';
import { selectToken, selectMode } from '../../store/user/userSlice';
import { NavLink } from 'react-router-dom';
import { Link } from '@mui/material';

import { allRoutes } from '../../routes/router.jsx';

import '../../components/Nav/app-header-nav.css';

const linkClass = ({ isActive, isPending }) =>
    'app-nav-link' + (isPending ? ' pending' : isActive ? ' active' : '');

const filterNav = loggedIn => route => {
    if (route.navHidden) { return false; }
    if (loggedIn && route.publicOnly) { return false; }
    if (route.public) { return true; }
    if (loggedIn) { return true; }
    return false;
}

const renderNavLink = (route, i) => {
    if (route.external) { 
        return (
            <Link key={i} href={route.targetURL} underline="none" >
                {route.name}
            </Link>
        ); 
    }

    return (
        <NavLink key={i} to={route.path} className={linkClass} >
            {route.name}
        </NavLink>
    );
};

function AppHeaderNav() {
    const mode = useSelector(selectMode);
    const loggedIn = Boolean(useSelector(selectToken));

    return (
        <div role="navigation" className={'app-header-nav ' + mode}>
            <div className="column">
                {allRoutes.filter(filterNav(loggedIn)).map(renderNavLink)}
            </div>
        </div>
    );
}

export default AppHeaderNav;
