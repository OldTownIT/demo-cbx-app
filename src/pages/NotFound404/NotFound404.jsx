import React from 'react';
import { Container } from '@mui/material';
import { useLoaderData } from 'react-router-dom';

import './not-found-404.css';

function Profile() {
    const loaderData = useLoaderData();
    if (self.DEBUG) {
        console.log('Meetings Page!', loaderData);
    }

    return (
        <Container
            className="page-meetings"
            sx={{ py: 2, position: 'relative' }}
        >
            <div className="column">
                <h1>Page Not Found: 404</h1>
            </div>
        </Container>
    );
}

export default Profile;
