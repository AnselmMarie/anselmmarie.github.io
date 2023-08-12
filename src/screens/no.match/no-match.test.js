import { render, cleanup } from '@testing-library/react';

import NoMatchScreen from './no.match.container';

afterEach(cleanup);

describe('<NoMatchScreen />', () => {
  test('should renders without crashing', () => {
    // const wrapper = render(<NoMatchScreen />);
    // expect(wrapper).toBeTruthy();
  });

  test('click homepage link to go back to homepage', () => { });
});
