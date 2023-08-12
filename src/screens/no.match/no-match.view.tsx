import { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { trackScreen } from '../../modules/track/track.module';

import './no-match.style.css';

const NoMatchView = (): ReactElement => {
  useEffect(() => {
    trackScreen();
  }, []);

  return (
    <div className="hero-error-container">
      <header className="hero-error">
        <div className="error-content">
          <h1>404</h1>
          <p>Sorry, this content doesn't exist.</p>

          <Link to={'/'}>Please return to the homepage</Link>
        </div>
      </header>
    </div>
  );
};

export default NoMatchView;
