/* Node Modules */
import React from 'react';
import {Link} from "react-router-dom";
/* Screen Content */
import './no.match.css';

export default () => {
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

    )
}