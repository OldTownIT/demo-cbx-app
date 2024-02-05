import { Outlet } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import AppHeader from './header/AppHeader.jsx';
import AppFooter from './footer/AppFooter.jsx';

export default function AppRoot() {
    return (
        <>
            <CssBaseline />

            <AppHeader />

            <div className="app-body">
                <Outlet />
            </div>

            <AppFooter />
        </>
    );
}
