/* Node Modules */
import React, {Fragment} from 'react';
import './homepage.styles.css';
/* Components */
import HeroComponent from '../../components/hero';
import FooterComponent from '../../components/footer';
import PortfolioItemComponent from '../../components/portfolio.item';
/* Modules */
import {trackScreen} from "../../modules/track/track.module";
/* JSON */
import portfolioData from '../../config/portfolio.item.json';

class HomepageContainer extends React.Component {

    /**
     * @function componentDidMount
     * @desc init function once the component mounts
     * @author Anselm Marie
     * @memberOf HomepageContainer
     */
    componentDidMount() {
        trackScreen();
    }

    /**
     * @function render
     * @desc renders the content for the class
     * @author Anselm Marie
     * @memberOf HomepageContainer
     */
    render() {

        return (

            <Fragment>

                <HeroComponent />

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

                    {portfolioData && portfolioData.data && portfolioData.data.length !== 0 &&
                    <div data-testid="portfolio-row" className="row">

                        {portfolioData.data.map((data, index) => {
                            return <PortfolioItemComponent
                                key={index}
                                item={data}
                                history={this.props.history} />
                        })}

                    </div>}

                    {portfolioData && portfolioData.data && portfolioData.data.length === 0 &&
                    <div data-testid="portfolio-row" className="row">
                        <div className="col-md">
                            <p>Working on new portfolio content.</p>
                        </div>
                    </div>}

                </div>

                <FooterComponent />

            </Fragment>

        );
    }

}

export default HomepageContainer;
