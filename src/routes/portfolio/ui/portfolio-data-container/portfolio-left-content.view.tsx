'use client';
import { ImagesDataInter, PortfolioDataInter, VideosDataInter } from '@/store';
import Image from 'next/image';
import { ReactElement } from 'react';
import DOMPurify from 'isomorphic-dompurify';

const PortfolioLeftContent = ({
  data,
}: {
  data: PortfolioDataInter;
}): ReactElement => {
  return (
    <>
      <div className="grow">
        <h4 className="mt-0 mb-1">{data?.company}</h4>
        <h1 className="mb-1">{data?.title}</h1>
        <h3 className="mt-0">{data?.subtitle}</h3>
        <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify?.sanitize(data?.description, {
              ADD_ATTR: ['target'],
            }),
          }}
        ></div>

        {data?.videos?.map((el: VideosDataInter, i: number): ReactElement => {
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
        })}

        {data?.images?.map((el: ImagesDataInter, i: number): ReactElement => {
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
        })}
      </div>
    </>
  );
};

export { PortfolioLeftContent };
