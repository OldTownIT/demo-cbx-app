import React from 'react';
import { Container } from '@mui/material';
import Counter from '../../components/Counter/Counter';
import TemplateTester from '../../components/TemplateTester/TemplateTester';
import { useLoaderData } from 'react-router-dom';

function Demo() {
    const loaderData = useLoaderData();
    if (self.DEBUG) {
        console.log('Themes Demo Page!', loaderData);
    }

    return (
        <Container sx={{ py: 2, position: 'relative' }}>
            <Counter />
            <TemplateTester />
        </Container>
    );
}

export default Demo;
