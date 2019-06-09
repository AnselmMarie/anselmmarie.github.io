/* Node Modules */
import React from 'react';
import {Link} from "react-router-dom";
/* Modules */
import {trackScreen} from "../../modules/track.module/track";
/* Screen Content */
import './no.match.css';

class NoMatch extends React.Component {

    /**
     * @function componentDidMount
     * @desc init function once the component mounts
     * @author Anselm Marie
     * @memberOf NoMatch
     */
    componentDidMount() {
        trackScreen();
    }

    /**
     * @function render
     * @desc renders the content for the class
     * @author Anselm Marie
     * @memberOf NoMatch
     */
    render() {
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

}

export default NoMatch;
