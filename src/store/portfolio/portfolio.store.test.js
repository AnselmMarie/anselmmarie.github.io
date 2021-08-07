/* Module */
import { clearPortfolio, getPortfolio, updatePortfolio } from './store';
/* JSON */
import portfolioData from '../config/portfolio.item.json';

describe('Store Functionality', () => {
  test('portfolio content starts as a null', () => {
    expect(getPortfolio()).toBeNull();
  });

  describe('should update and clear portfolio content', () => {
    test('update the portfolio content', () => {
      updatePortfolio(portfolioData.data[0]);
      expect(getPortfolio()).toMatchObject(portfolioData.data[0]);
    });

    test('should clear portfolio content', () => {
      clearPortfolio();
      expect(getPortfolio()).toBeNull();
    });
  });

  test('portfolio that was updated with wrong content should return as an empty object', () => {
    updatePortfolio('Hi');
    expect(getPortfolio()).toBeNull();
  });
});
