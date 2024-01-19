'use client';
import { ImagesDataInter, VideosDataInter, usePortfolioStore } from '@/store';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
import { ReactElement } from 'react';
import DOMPurify from 'dompurify';

export default function Page(): ReactElement {
  const item = usePortfolioStore((state) => state.item);
  const otherData = usePortfolioStore((state) => state.otherData);
  const activeData = usePortfolioStore((state) => state.activeData);

  let finalItem = item;

  if (!finalItem) {
    const combineData = [...otherData, ...activeData];
    finalItem = combineData.find((el) => el?.id === 'cw-breeze-thru') || null;
  }

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

          {finalItem ? (
            <div className="grow">
              <h4 className="mt-0 mb-1">{finalItem?.company}</h4>
              <h1 className="mb-1">{finalItem?.title}</h1>
              <h3 className="mt-0">{finalItem?.subtitle}</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify?.sanitize(finalItem?.description, {
                    ADD_ATTR: ['target'],
                  }),
                }}
              ></p>
              {finalItem?.videos?.map(
                (el: VideosDataInter, i: number): ReactElement => {
                  return (
                    <div className="portfolio-video" key={i}>
                      <div className="w-full md:w-3/4 h-auto relative mx-auto mt-10 flex flex-col text-center items-center overflow-hidden">
                        <p>{el.title}</p>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify?.sanitize(el?.description, {
                              ADD_ATTR: ['target'],
                            }),
                          }}
                        ></p>
                        <iframe
                          className="aspect-video max-w-5xl"
                          width="100%"
                          title={el.title}
                          src={el.src}
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  );
                }
              )}

              {finalItem?.images?.map(
                (el: ImagesDataInter, i: number): ReactElement => {
                  return (
                    <div
                      key={i}
                      className="md:w-3/4 h-auto relative mx-auto mt-10 flex justify-center"
                    >
                      <Image
                        src={el.src}
                        alt={el.alt}
                        width={Number(el.width)}
                        height={Number(el.height)}
                        quality={85}
                      />
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <h4 className="mt-1">
              Apologies, but the portfolio content you&apos;re seeking
              isn&apos;t available.
              <br />
              Kindly use the back link to return to the homepage.
            </h4>
          )}
        </div>
      </div>
    </>
  );
}
