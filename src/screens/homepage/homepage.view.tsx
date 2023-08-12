import { useEffect, ReactElement } from 'react';

import { portfolioData, PortfolioItem } from '../../store/portfolio';

import UiHero from '../../ui/hero';
import UiPortfolioItem from '../../ui/portfolio.item';
import { trackScreen } from '../../modules/track/track.module';

import './homepage.style.css';

const HomepageView = (): ReactElement => {
  useEffect(() => {
    trackScreen();
  }, []);

  return (
    <>
      <UiHero />

      <div data-testid="skills-row" className="container skills-container">
        <div className="row">
          <div className="col-one col-xs-12 col-md offset-md-1">
            <h3>Design</h3>
            <ul>
              <li>Desktop</li>
              <li>Mobile</li>
              <li>UI/UX</li>
              <li>Figma</li>
              <li>Sketch</li>
              <li>Adobe XD</li>
            </ul>
          </div>

          <div className="col-two col-xs-12 col-md offset-md-1">
            <h3>Development</h3>
            <ul>
              <li>Desktop</li>
              <li>Backend</li>
              <li>Mobile</li>
              <li>Design System</li>
              <li>Micro Frontend</li>
              <li>Rest APIs</li>
              <li>GraphQL</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container my-work-container">
        <h3>My Work</h3>

        {portfolioData?.data && portfolioData?.data?.length !== 0 && (
          <div data-testid="portfolio-row" className="row">
            {portfolioData.data.map(
              (data: PortfolioItem, index: number): ReactElement => {
                return <UiPortfolioItem key={index} item={data} />;
              }
            )}
          </div>
        )}

        {(!portfolioData?.data || portfolioData?.data.length === 0) && (
          <div data-testid="portfolio-row" className="row">
            <div className="col-md">
              <p>Working on new portfolio content.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomepageView;
