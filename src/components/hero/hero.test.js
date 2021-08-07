import React from 'react';
import { render, cleanup } from "@testing-library/react";

import Hero from './index';

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
