import { ReactElement } from 'react';

import { ChevronLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

import { PortfolioStoreItem } from '@/store';

import { PortfolioLeftContent } from './portfolio-left-content.view';

const PortfolioDataContainer = ({
  data,
}: {
  data: PortfolioStoreItem;
}): ReactElement => {
  return (
    <>
      <div className="mt-5 px-5 mb-96">
        <div className="flex w-full">
          <div className="mr-9">
            <Link href="/">
              <div className="flex items-center">
                <ChevronLeftIcon /> Back
              </div>
            </Link>
          </div>

          <div className="grow">
            {!data ? (
              <h4 className="mt-1">
                Apologies, but the portfolio content you&apos;re seeking
                isn&apos;t available.
                <br />
                Kindly use the back link to return to the homepage.
              </h4>
            ) : (
              <PortfolioLeftContent data={data} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export { PortfolioDataContainer };
