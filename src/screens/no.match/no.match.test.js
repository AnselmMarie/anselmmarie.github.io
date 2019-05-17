/* Node Modules */
import React from 'react';
import {render, cleanup} from "react-testing-library";
import NoMatch from './no.match';

afterEach(cleanup);

describe('<NoMatch />', () => {

    test('should renders without crashing', () => {
        // const wrapper = render(<NoMatch />);
        // expect(wrapper).toBeTruthy();
    });

    test('click homepage link to go back to homepage', () => {
    });

});
