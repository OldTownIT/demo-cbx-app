import react from '@vitejs/plugin-react-swc';
// import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import postcssNesting from 'postcss-nesting';
import * as path from 'path';
import BUILD from './config/env/build-settings.js';
// import sslSettings from './config/ssl-settings.js';


export default defineConfig({
    envDir: './config/env/',
    css: {
        postcss: {
            plugins: [postcssNesting],
        },
    },
    plugins: [react()],
    publicDir: 'src/assets',
    define: {
        DEBUG: JSON.stringify('DEBUG'),
        ts: JSON.stringify(Date.now()),
    },
    build: {
        sourcemap: false,
        define: {
            DEBUG: JSON.stringify('false'),
            ts: JSON.stringify(Date.now()),
        },
        outDir: BUILD.TARGET_DIRECTORY
    },
    resolve: {
        alias: {
            // eslint-disable-next-line no-undef
            '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    // ---- COMMENT OUT THIS "server" SECTION IF YOU CAN'T USE HTTPS ----
    // server: {
    //     port: 443,
    //     host: '127.0.0.6',
    //     https: sslSettings,
    // },
    // ---- -------- ---- ---- ---- ---- ---- ---- ---- ---- ---- -------

    test: {
        define: {
            DEBUG: JSON.stringify('false')
        },
        css: true,
        environment: 'jsdom',
        globals: true,
        include: ['src/**/__tests__/*'],
        setupFiles: 'src/util/testing/setupTests.js',
    },
});
