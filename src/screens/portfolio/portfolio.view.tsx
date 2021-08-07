import React, { ReactElement } from 'react';
import DOMPurify from 'dompurify';
import { NavLink, RouteComponentProps } from 'react-router-dom';

import usePortfolioLogic, { PortfolioLogicReturn } from './use.portfolio.logic';
import './portfolio.styles.css';

const config = {
  ADD_ATTR: ['target'],
};
const homepageLink = '< Homepage';

interface PortfolioProps extends RouteComponentProps {}

const PortfolioView = ({ match, history }: PortfolioProps): ReactElement => {
  const { item } = usePortfolioLogic({ match, history });

  if (!item) {
    return <p>loading....</p>;
  }

  return (
    <>
      <div className="portfolio-nav-bg">
        <nav className="container portfolio-nav-container">
          <NavLink to="/">{homepageLink}</NavLink>
        </nav>
      </div>

      <div className="portfolio-header-bg">
        <header className="container portfolio-header-container">
          <h1>{item.title}</h1>
          <h2>{item.subtitle}</h2>
        </header>
      </div>

      <div className="container">
        <p
          className="portfolio-description"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(item.description, config),
          }}
        ></p>

        {item.videos && (
          <div className="videos-container">
            {item.videos.map((data: any, index: number): ReactElement => {
              return (
                <div className="portfolio-video" key={index}>
                  <p>{data.description}</p>
                  <iframe
                    width="560"
                    height="315"
                    title={data.title}
                    src={data.src}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              );
            })}
          </div>
        )}

        <div className="image-container">
          {item.images.map(
            (data: any, index: number): ReactElement => (
              <img
                className="portfolio-image"
                src={
                  require(`../../assets/images/portfolio/${data.src}`).default
                }
                alt={data.alt}
                key={index}
              />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default PortfolioView;
