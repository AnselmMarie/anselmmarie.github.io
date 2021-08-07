import { updatePortfolio } from '../../store/portfolio';

import './portfolio.item.styles.css';

const usePortfolioItemLogic = () => {
  const goToPortfolio = (history, item) => {
    updatePortfolio(item);
    history.push(`/portfolio/${item.url}`);
  };

  const getImagePath = (thumbnail) => {
    let path;

    try {
      path = require(`../../assets/images/portfolio/${thumbnail}`);
    } catch (e) {
      path = '';
    }

    return path.default;
  };

  return {
    onGoToPortfolio: goToPortfolio,
    onGetImagePath: getImagePath,
  };
};

export default usePortfolioItemLogic;
