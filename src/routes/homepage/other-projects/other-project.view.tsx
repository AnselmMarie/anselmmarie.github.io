'use client';

import { Container } from '@radix-ui/themes';

import { PortfolioDataInter, usePortfolioStore } from '@/store';

import { UiProjectGrid } from '../ui/project-grid/project-grid.view';

export const OtherProjects = () => {
  const addItem = usePortfolioStore((state) => state.addItem);
  const otherData = usePortfolioStore((state) => state.otherData);
  const toGoScreen = (el: PortfolioDataInter): void => {
    addItem(el);
  };

  return (
    <>
      <div className="px-5 my-72">
        <Container size="4">
          <h2 className="text-center text-sky-700">Other Projects</h2>
          <UiProjectGrid data={otherData} onClick={toGoScreen} />
        </Container>
      </div>
    </>
  );
};
