import portfolioData from './portfolio.item.json';
import {
  getPortfolio,
  clearPortfolio,
  updatePortfolio,
} from './portfolio.store';
import { PortfolioImagesInter, PortfolioItemInter } from './portfolio.type';

export { getPortfolio, clearPortfolio, portfolioData, updatePortfolio };
export interface PortfolioImages extends PortfolioImagesInter {}
export interface PortfolioItem extends PortfolioItemInter {}
