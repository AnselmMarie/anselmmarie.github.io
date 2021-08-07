import { useEffect, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { portfolioData, PortfolioItem } from '../../store/portfolio';

import UiHero from '../../ui/hero';
import UiPortfolioItem from '../../ui/portfolio.item';
import { trackScreen } from '../../modules/track/track.module';

import './homepage.style.css';

interface HomepageProps extends RouteComponentProps {}

const HomepageView = ({ history }: HomepageProps): ReactElement => {
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
              <li>Mobile Design</li>
              <li>Desktop Design</li>
              <li>UX</li>
              <li>UI</li>
              <li>Sketch</li>
              <li>Photoshop</li>
            </ul>
          </div>

          <div className="col-two col-xs-12 col-md offset-md-1">
            <h3>Development</h3>
            <ul>
              <li>Mobile Development</li>
              <li>Desktop Development</li>
              <li>Backend Development</li>
              <li>Modern Javascript</li>
              <li>Rest</li>
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
                return (
                  <UiPortfolioItem key={index} item={data} history={history} />
                );
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
