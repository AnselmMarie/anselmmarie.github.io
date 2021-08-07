import { PortfolioItemInter } from './portfolio.type';

let portfolioItem: PortfolioItemInter | null = null;

export const updatePortfolio = (item: PortfolioItemInter): void => {
  if (!item || typeof item !== 'object') {
    console.log('Item is not an object');
    return;
  }

  portfolioItem = item;
};

export const getPortfolio = () => {
  return portfolioItem;
};

export const clearPortfolio = (): void => {
  portfolioItem = null;
};
