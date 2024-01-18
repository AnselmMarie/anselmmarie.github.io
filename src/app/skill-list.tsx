import '@radix-ui/themes/styles.css';
import {
  developerConst,
  developerToolsConst,
  uiUxConst,
} from './skill-list.const';
import { CodeIcon, LayersIcon } from '@radix-ui/react-icons';
import { SkillListSection } from './skill-list-section';

export const SkillList = () => {
  return (
    <>
      <div className="px-5 mt-72">
        <div className="mt-20 flex flex-col md:flex-row w-full justify-center">
          <div className="f-full md:w-1/4 flex mr-5 mb-9">
            <div className="mr-1 mt-1">
              <CodeIcon width="25" height="25" color="#0369a1" />
            </div>
            <div>
              <SkillListSection
                sectionName="Developer"
                dataList={developerConst}
              />
            </div>
          </div>
          <div className="f-full md:w-1/4 flex mr-5 mb-9">
            <div className="mr-1 mt-1">
              <CodeIcon width="25" height="25" color="#0369a1" />
            </div>
            <div>
              <SkillListSection
                sectionName="Developer Tools"
                dataList={developerToolsConst}
              />
            </div>
          </div>
          <div className="f-full md:w-1/4 flex mr-5 mb-9">
            <div className="mr-1 mt-1">
              <LayersIcon width="25" height="25" color="#0369a1" />
            </div>
            <div>
              <SkillListSection sectionName="UI/UX" dataList={uiUxConst} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
