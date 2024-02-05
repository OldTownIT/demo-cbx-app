import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import store from '../store/store';
import router from '../routes/router.jsx';
import AppThemeProvider from '../themes/AppThemeProvider';

export default function AppRoot() {
    return (
        <Provider store={store}>
            <AppThemeProvider>
                <RouterProvider router={router} />
            </AppThemeProvider>
        </Provider>
    );
}
