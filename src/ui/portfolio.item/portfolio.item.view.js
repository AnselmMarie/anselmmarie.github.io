import React from 'react';

import usePortfolioItemLogic from './use.portfolio.item.logic';
import './portfolio.item.style.css';

const PortfolioItemView = ({ item, history }) => {
  const { onGoToPortfolio, onGetImagePath } = usePortfolioItemLogic();

  return (
    <div
      onClick={() => onGoToPortfolio(history, item)}
      className="portfolio-item"
    >
      <div
        className="image-style"
        style={{ backgroundImage: `url(${onGetImagePath(item.thumbnail)}` }}
      >
        <div className="bg-fade">
          <div className="row portfolio-row">
            <div className="portfolio-content">
              <h4>{item.title}</h4>
              <h5>{item.subtitle}</h5>
              <h6>{item.company}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemView;
