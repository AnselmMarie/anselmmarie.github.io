/* Node Modules */
import React from "react";
/* Assets */
import pdf from '../../assets/pdf/anselm-marie-resume.pdf';
import resumeIcon from '../../assets/images/resume-icon.png';
/* Component Styles */
import './hero.css';

export default () => {
    return (

        <div className="hero-container">
            <header className="hero">
                <div>
                    <div className="top-hero">
                        <h1>Application Developer <br/>
                        UI Designer <br/>
                        Web Designer</h1>
                    </div>

                    <div className="bottom-hero">
                        <h2>Anselm Marie</h2>
                        <a className="download-resume-link" href={pdf} target="_blank" rel="noopener noreferrer"><img className="download-resume-icon" src={resumeIcon} alt="Download Resume" />  Download Resume</a>
                    </div>

                </div>
            </header>
        </div>

    )
}