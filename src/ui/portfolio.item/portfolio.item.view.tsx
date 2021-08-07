import { ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { PortfolioItem } from 'src/store/portfolio';

import usePortfolioItemLogic from './use.portfolio.item.logic';
import './portfolio.item.style.css';

interface PortfolioItemProp extends Partial<RouteComponentProps> {
  item: PortfolioItem;
}

const PortfolioItemView = ({
  item,
  history,
}: PortfolioItemProp): ReactElement => {
  const { onGoToPortfolio, onGetImagePath } = usePortfolioItemLogic({
    history,
  });

  return (
    <div onClick={() => onGoToPortfolio(item)} className="portfolio-item">
      <div
        className="image-style"
        style={{
          backgroundImage: `url(${onGetImagePath(item?.thumbnail || '')}`,
        }}
      >
        <div className="bg-fade">
          <div className="row portfolio-row">
            <div className="portfolio-content">
              <h4>{item?.title}</h4>
              <h5>{item?.subtitle}</h5>
              <h6>{item?.company}</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemView;
