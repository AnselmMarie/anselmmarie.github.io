import { ReactElement } from 'react';

import './footer.style.css';

const FooterView = (): ReactElement => {
  return (
    <footer className="container-fluid">
      <div className="row footer-row">
        <a
          className="footer-href"
          href="https://itunes.apple.com/profile/ansmarie"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            onMouseOver={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/apple-music-icon.png').default)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/apple-music-icon-white.png').default)
            }
            src={
              require('../../assets/images/apple-music-icon-white.png').default
            }
            alt="Apple Music Icon"
          />
        </a>
        <a
          className="footer-href"
          href="https://open.spotify.com/user/126462549"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            onMouseOver={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/spotify-icon.png').default)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/spotify-icon-white.png').default)
            }
            src={require('../../assets/images/spotify-icon-white.png').default}
            alt="Spotify Icon"
          />
        </a>
        <a
          className="footer-href"
          href="https://www.linkedin.com/in/anselm-marie/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            onMouseOver={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/linkedin-icon.png').default)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/linkedin-icon-white.png').default)
            }
            src={require('../../assets/images/linkedin-icon-white.png').default}
            alt="LinkedIn Icon"
          />
        </a>
        <a
          className="footer-href"
          href="https://github.com/AnselmMarie"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            onMouseOver={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/GitHub-Mark-32px.png').default)
            }
            onMouseOut={(e) =>
              (e.currentTarget.src =
                require('../../assets/images/GitHub-Mark-Light-32px.png').default)
            }
            src={
              require('../../assets/images/GitHub-Mark-Light-32px.png').default
            }
            alt="GitHub Icon"
          />
        </a>
      </div>
    </footer>
  );
};

export default FooterView;
