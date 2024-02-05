import App from '../App.jsx';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Simple working test', () => {
    self.DEBUG = false;

    beforeEach(() => {
        self.DEBUG = false;
        render(<App />);
    });

    it('App Header - the title is visible', async () => {
        await screen.findByText(/EzBiz/i);
        expect(screen.getByText(/EzBiz/i)).toBeInTheDocument();
    });

    it('Redux demo - should increment count on click', async () => {
        await screen.findByTitle('Increment value');
        userEvent.click(screen.getByTitle('Increment value'));
        expect(await screen.findByText(/Count is: 1/i)).toBeInTheDocument();
    });

    it('App Nav -- class name and uses flexbox', async () => {
        await screen.findByRole('navigation');
        const element = screen.getByRole('navigation');
        expect(element.getAttribute('class')).toContain('app-header-nav');
        expect(getComputedStyle(element).display).toEqual('flex');
    });
});
