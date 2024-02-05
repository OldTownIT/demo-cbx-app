import React from 'react';
import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';

import { selectClientBase } from '../../store/clients/clientSlice.js';
import './page-main.css';

const sx = { py: 2, position: 'relative' }; // DEMO MUI STYLES

function MainPage() {
    const loaderData = useLoaderData();
    const clientBase = useSelector(selectClientBase);
    if (self.DEBUG) {
        console.log('Main Page!', loaderData);
        console.log('clientBase', clientBase);
    }

    return (
        <Container className="page-main" sx={sx} >
            <div className="column">
                <h1>Main Page</h1>
            </div>
        </Container>
    );
}

export default MainPage;
