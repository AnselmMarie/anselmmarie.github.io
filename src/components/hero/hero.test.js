/* Node Modules */
import React from 'react';
import {render, cleanup} from "react-testing-library";
/* Components */
import Hero from './/hero';

afterEach(cleanup);

describe('<Hero />', () => {

    test('class renders without crashing', () => {
        const wrapper = render(<Hero />);
        expect(wrapper).toBeTruthy();
    });

    test('check snapshot', () => {
        const wrapper = render(<Hero />);
        expect(wrapper).toMatchSnapshot();
    });

});
