import { useNavigate } from 'react-router-dom';

import { PortfolioItem, updatePortfolio } from '../../store/portfolio';

interface PortfolioItemLogicReturn {
  onGoToPortfolio: (item: PortfolioItem) => void;
  onGetImagePath: (thumbnail: string) => string;
}

const usePortfolioItemLogic = (): PortfolioItemLogicReturn => {
  const navigate = useNavigate();
  const goToPortfolio = (item: PortfolioItem): void => {
    updatePortfolio(item);
    navigate(`/portfolio/${item?.url}`);
  };

  const getImagePath = (thumbnail: string = ''): string => {
    let path;

    try {
      path = require(`../../assets/images/portfolio/${thumbnail}`);
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
