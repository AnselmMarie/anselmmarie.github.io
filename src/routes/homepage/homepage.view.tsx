import { ReactElement } from 'react';

import { ActiveProjects } from './active-projects';
import { HeroSection } from './hero-section';
import { OtherProjects } from './other-projects';
import { SkillList } from './skill-list';

const HomepageRoute = (): ReactElement => {
  return (
    <>
      <HeroSection />
      <SkillList />
      <ActiveProjects />
      <OtherProjects />
    </>
  );
};

export { HomepageRoute };
