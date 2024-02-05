import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { logOut, selectToken } from '../../store/user/userSlice.js';
import { logOutClients } from '../../store/clients/clientSlice.js';

// eslint-disable-next-line no-unused-vars
import './app-footer.css';

function AppFooter() {
    const loggedIn = Boolean(useSelector(selectToken));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logOutUser = (e) => {
        e.preventDefault();
        dispatch(logOut());
        dispatch(logOutClients());
        navigate('.', { replace: true });
    };

    return (
        <div className="app-footer">
            <div className="column">
                <h1>The Footer</h1>
                {loggedIn && (
                   <a href="/logout" onClick={logOutUser} className="footer-link" >
                       Log Out
                   </a>
                )}                
            </div>
        </div>
    );
}

export default AppFooter;
