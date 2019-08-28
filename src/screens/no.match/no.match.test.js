/* Node Modules */
import React from 'react';
import {render, cleanup} from "react-testing-library";
import NoMatchContainer from './no.match.container';

afterEach(cleanup);

describe('<NoMatchContainer />', () => {

    test('should renders without crashing', () => {
        // const wrapper = render(<NoMatchContainer />);
        // expect(wrapper).toBeTruthy();
    });

    test('click homepage link to go back to homepage', () => {
    });

});
