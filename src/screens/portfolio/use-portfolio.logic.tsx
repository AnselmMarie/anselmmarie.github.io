import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { trackScreen } from '../../modules/track/track.module';
import {
  getPortfolio,
  clearPortfolio,
  portfolioData,
  PortfolioItem,
} from '../../store/portfolio';

interface PortfolioLogicReturn {
  item: PortfolioItem;
}

const usePortfolioLogic = (): PortfolioLogicReturn => {
  const [item, setItem] = useState<PortfolioItem>(null);
  const navigate = useNavigate();
  const params = useParams();

  const getContent = (): PortfolioItem => {
    const url = `${params?.company}/${params?.project}`;
    const data = portfolioData.data.find((el: PortfolioItem): boolean => {
      return el?.url === url;
    });

    return data ?? null;
  };

  const checkItem = (): void => {
    let item: PortfolioItem = getPortfolio();

    /* If the data doesn't exist the application will try to manually get the data */
    if (!item) {
      item = getContent();
    }

    /* If the data still doesn't exist then redirect to the error screen */
    if (!item) {
      navigate('/404');
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
