import { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { trackScreen } from '../../modules/track/track.module';
import {
  getPortfolio,
  clearPortfolio,
  portfolioData,
  PortfolioItem,
} from '../../store/portfolio';

interface PortfolioLogicProps extends Partial<RouteComponentProps> {}

interface PortfolioLogicReturn {
  item: PortfolioItem;
}

const usePortfolioLogic = ({
  match,
  history,
}: PortfolioLogicProps): PortfolioLogicReturn => {
  const [item, setItem] = useState<any>(null);
  console.log('item', item);
  console.log('match', match);

  const getContent = () => {
    const params: any = match?.params;
    const url = `${params?.company}/${params?.project}`;
    console.log('portfolioData.data', portfolioData.data);
    return portfolioData.data.find((el) => {
      return el.url === url;
    });
  };

  const checkItem = () => {
    let item: any = getPortfolio();

    /* If the data doesn't exist the application will try to manually get the data */
    if (!item) {
      item = getContent();
    }

    /* If the data still doesn't exist then redirect to the error screen */
    if (!item) {
      history?.push(`/404`);
    }

    setItem(item);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    checkItem();
    trackScreen();

    return () => {
      clearPortfolio();
    };
  }, []);

  return {
    item,
  };
};

export default usePortfolioLogic;
