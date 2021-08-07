import { RouteComponentProps } from 'react-router-dom';

import { PortfolioItem, updatePortfolio } from '../../store/portfolio';

interface PortfolioItemProp extends Partial<RouteComponentProps> {}

interface PortfolioItemLogicReturn {
  onGoToPortfolio: (item: PortfolioItem) => void;
  onGetImagePath: (thumbnail: string) => string;
}

const usePortfolioItemLogic = ({
  history,
}: PortfolioItemProp): PortfolioItemLogicReturn => {
  const goToPortfolio = (item: PortfolioItem): void => {
    updatePortfolio(item);
    history?.push(`/portfolio/${item?.url}`);
  };

  const getImagePath = (thumbnail: string = ''): string => {
    let path;

    try {
      path = require(`../../assets/images/portfolio/${thumbnail}`).default;
    } catch (e) {
      path = '';
    }

    return path;
  };

  return {
    onGoToPortfolio: goToPortfolio,
    onGetImagePath: getImagePath,
  };
};

export default usePortfolioItemLogic;
