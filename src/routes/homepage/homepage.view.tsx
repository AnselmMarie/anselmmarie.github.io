import { HeroSection } from './hero-section';
import { SkillList } from './skill-list';
import { ActiveProjects } from './active-projects';
import { OtherProjects } from './other-projects';
import { ReactElement } from 'react';

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
