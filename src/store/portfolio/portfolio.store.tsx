import { PortfolioItem } from './';

let portfolioItem: PortfolioItem = null;

export const updatePortfolio = (item: PortfolioItem): void => {
  if (!item || typeof item !== 'object') {
    console.log('Item is not an object');
    return;
  }

  portfolioItem = item;
};

export const getPortfolio = (): PortfolioItem | null => {
  return portfolioItem;
};

export const clearPortfolio = (): void => {
  portfolioItem = null;
};
