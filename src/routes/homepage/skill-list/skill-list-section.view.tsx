import { Heading } from '@radix-ui/themes';
import { ReactElement } from 'react';
import { SkillListSectionProps } from './skill-list-section.interface';

export const SkillListSection = ({
  dataList,
  sectionName,
  hideHeader = false,
}: SkillListSectionProps): ReactElement => {
  return (
    <>
      <Heading
        as="h4"
        className={`flex items-center text-sky-700 ${
          !hideHeader ? '' : 'invisible'
        }`}
      >
        {sectionName}
      </Heading>
      <ul className="mt-0 mb-0">
        {dataList.map(
          (el, i: number): ReactElement => (
            <li key={i} className="mb-1">
              {el}
            </li>
          )
        )}
      </ul>
    </>
  );
};
