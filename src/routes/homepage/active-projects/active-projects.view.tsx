'use client';

import { Container } from '@radix-ui/themes';

import { PortfolioDataInter, usePortfolioStore } from '@/store';

import { UiProjectGrid } from '../ui/project-grid/project-grid.view';

export const ActiveProjects = () => {
  const addItem = usePortfolioStore((state) => state.addItem);
  const activeData = usePortfolioStore((state) => state.activeData);
  const toGoScreen = (el: PortfolioDataInter): void => {
    addItem(el);
  };

  return (
    <>
      <div className="px-5 mt-72">
        <Container size="4">
          <h2 className="text-center text-sky-700">
            Active Project - Cosmikata
          </h2>
          <div className="grid">
            <UiProjectGrid data={activeData} onClick={toGoScreen} />
          </div>
        </Container>
      </div>
    </>
  );
};
