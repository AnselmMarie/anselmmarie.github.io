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
        <div className="max-w-7xl mx-auto mt-20 flex flex-col lg:flex-row justify-center">
          <div className="md:w-full lg:w-2/3 flex mb-9 p-10 rounded-md border border-slate-200 drop-shadow-sm bg-white">
            <div className="mr-1 mt-1">
              <CodeIcon width="25" height="25" color="#0369a1" />
            </div>
            <div className="flex w-full flex-col md:flex-row">
              <div className="flex-1">
                <SkillListSection
                  sectionName="Developer"
                  dataList={developerConst}
                />
              </div>
              <div className="flex-1 hidden md:block">
                <SkillListSection
                  sectionName="Developer"
                  dataList={developerToolsConst}
                  hideHeader
                />
              </div>
              <div className="flex-1 block md:hidden">
                <SkillListSection dataList={developerToolsConst} />
              </div>
            </div>
          </div>

          <div className="md:w-full lg:w-1/3 flex mb-9 p-10 rounded-md border border-slate-200 drop-shadow-sm bg-white">
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
