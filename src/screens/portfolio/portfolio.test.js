import React from 'react';
import { cleanup, render } from '@testing-library/react';

import portfolioJSON from '../../config/portfolio.item.json';
// import {getPortfolio, updatePortfolio} from "../../data.store/store";

import PortfolioScreen from './portfolio.view';

const urlSplit = portfolioJSON.data[0].url.split('/');

const props404 = {
  history: [],
  match: {
    params: {
      company: 'example company',
      project: 'example project',
    },
  },
};

const propsCorrect = {
  history: [],
  match: {
    params: {
      company: urlSplit[0],
      project: urlSplit[1],
    },
  },
};

beforeEach(() => {
  window.scrollTo = jest.fn();
});

afterEach(cleanup);

describe(`<Portfolio />`, () => {
  test("When the portfolio content doesn't exist", () => {
    render(<PortfolioScreen {...props404} />);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(props404.history[0]).toBe('/404');
  });

  test('When the portfolio content is manually added', () => {
    // const wrapper = setupMount(propsCorrect);
    // console.log('propsCorrect', propsCorrect);
    // wrapper.unmount();
  });

  test('When the portfolio content is already present', () => {
    // updatePortfolio(portfolioJSON.data[0]);
    //
    // console.log('getPortfolio', getPortfolio());
    //
    // const wrapper = setupMount();
    //
    // wrapper.unmount();
  });
});
