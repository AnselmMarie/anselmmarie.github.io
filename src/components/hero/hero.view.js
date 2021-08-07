import React from 'react';

import pdf from '../../assets/pdf/anselm-marie-resume.pdf';
import resumeIcon from '../../assets/images/resume-icon.png';

import './hero.styles.css';

const HeroView = () => {
    return (
        <div className="hero-container">
            <header className="hero">
                <div>
                    <div className="top-hero">
                        <h1>Software Engineer <br />
                            UI Designer <br />
                            Web Designer
                        </h1>
                    </div>

                    <div className="bottom-hero">
                        <h2>Anselm Marie</h2>
                        <a className="download-resume-link" href={pdf} target="_blank" rel="noopener noreferrer"><img className="download-resume-icon" src={resumeIcon} alt="Resume" />  Resume</a>
                    </div>

                </div>
            </header>
        </div>
    );
}

export default HeroView;