import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';
import { ProjectGridProps, ProjectItemProps } from './project-grid.interface';

export const UiProjectGrid = ({
  data,
  onClick,
}: ProjectGridProps): ReactElement => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {data.map((el: ProjectItemProps, i: number) => {
        const paddingClass = i % 2 ? 'md:ml-5' : 'md:mr-5';
        return (
          <div
            key={i}
            className={`${paddingClass} text-center mb-10 opacity-75 hover:opacity-90 hover:drop-shadow-2xl hover:transition-all`}
          >
            <Link href={`portfolio/${el.id}`} onClick={() => onClick(el)}>
              <div className="h-96 relative rounded-lg mb-5">
                <Image
                  src={el.thumbnail}
                  alt="portfolio image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-lg object-cover m-0"
                />
              </div>
              <span className="font-bold">{el.title}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
