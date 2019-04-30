/* Node Modules */
import React from "react";
/* Component Style */
import './footer.css';

export default () => {
    return (

        <footer className="container-fluid">
            <div className="row footer-row">
                <a href="https://itunes.apple.com/profile/ansmarie" target="_blank" rel="noopener noreferrer">
                    <img
                        onMouseOver={(e) => (e.currentTarget.src = require('../../assets/images/apple-music-icon.png'))}
                        onMouseOut={(e) => (e.currentTarget.src = require('../../assets/images/apple-music-icon-white.png'))}
                        src={require('../../assets/images/apple-music-icon-white.png')}
                        alt="Apple Music"
                        className="footer-icon" />
                </a>
                <a href="https://open.spotify.com/user/126462549" target="_blank" rel="noopener noreferrer">
                    <img
                        onMouseOver={(e) => (e.currentTarget.src = require('../../assets/images/spotify-icon.png'))}
                        onMouseOut={(e) => (e.currentTarget.src = require('../../assets/images/spotify-icon-white.png'))}
                        src={require('../../assets/images/spotify-icon-white.png')}
                        alt="Spotify"
                        className="footer-icon" />
                </a>
                <a href="https://www.linkedin.com/in/anselm-marie/" target="_blank" rel="noopener noreferrer">
                    <img
                        onMouseOver={(e) => (e.currentTarget.src = require('../../assets/images/linkedin-icon.png'))}
                        onMouseOut={(e) => (e.currentTarget.src = require('../../assets/images/linkedin-icon-white.png'))}
                        src={require('../../assets/images/linkedin-icon-white.png')}
                        alt="LinkedIn"
                        className="footer-icon" />
                </a>
            </div>
        </footer>

    )
}