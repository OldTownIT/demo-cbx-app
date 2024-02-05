import React from 'react';
import { Stack, Typography } from '@mui/material';

import AppHeaderNav from '../../components/Nav/AppHeaderNav.jsx';

import './app-header.css';

const dotStyle = { 
    fontSize: '1.6em', 
    lineHeight: 1
};

function Dot() {
    return <span style={dotStyle}>·</span>;
}

function AppHeader() {
    return (
        <div className="app-header">
            <Stack className="app-header-main" gap={1} my={2}>
                <Typography textAlign="center" variant="h2">
                    C<Dot />B<Dot />X
                </Typography>
                <Typography textAlign="center" variant="subtitle1">
                    S S O 
                </Typography>
            </Stack>
            <AppHeaderNav />
        </div>
    );
}

export default AppHeader;
