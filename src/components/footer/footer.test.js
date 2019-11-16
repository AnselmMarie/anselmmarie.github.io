/* Node Modules */
import React from 'react';
import {render, cleanup} from '@testing-library/react';
/* Component */
import Footer from './footer.container';

afterEach(cleanup);

describe('<Footer />', () => {

    test('should render', () => {
        const wrapper = render(<Footer />);
        expect(wrapper).toBeTruthy();
    });

    test('should check snapshot', () => {
        const wrapper = render(<Footer />);
        expect(wrapper).toMatchSnapshot();
    });

});
