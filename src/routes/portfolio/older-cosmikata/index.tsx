'use client';
import { usePortfolioStore } from '@/store';
import { ReactElement } from 'react';
import { PortfolioDataContainer } from '../ui/portfolio-data-container';

const PortfolioOlderCosmikataRoute = (): ReactElement => {
  const item = usePortfolioStore((state) => state.item);
  const otherData = usePortfolioStore((state) => state.otherData);
  const activeData = usePortfolioStore((state) => state.activeData);

  let finalItem = item;

  if (!finalItem) {
    const combineData = [...otherData, ...activeData];
    finalItem = combineData.find((el) => el?.id === 'older-cosmikata') || null;
  }

  return <PortfolioDataContainer data={finalItem} />;
};

export { PortfolioOlderCosmikataRoute };
