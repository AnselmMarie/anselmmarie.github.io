import '@radix-ui/themes/styles.css';
import { HeroSection } from './hero-section';
import { SkillList } from './skill-list';
import { ActiveProjects } from './active-projects';
import { OtherProjects } from './other-projects';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SkillList />
      <ActiveProjects />
      <OtherProjects />
    </>
  );
}
