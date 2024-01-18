import '@radix-ui/themes/styles.css';
import { Heading } from '@radix-ui/themes';
import { ReactElement } from 'react';

interface SkillListSectionProps {
  sectionName: string;
  dataList: Array<String>;
}

export const SkillListSection = ({
  dataList,
  sectionName,
}: SkillListSectionProps): ReactElement => {
  return (
    <>
      <Heading as="h4" className="flex items-center text-sky-700">
        {sectionName}
      </Heading>
      <ul className="mt-2">
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
