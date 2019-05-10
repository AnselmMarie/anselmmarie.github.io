/* Node Modules */
import React, {Fragment} from 'react';
import './homepage.css';
/* Components */
import HeroComponent from '../../components/hero.component/hero';
import FooterComponent from '../../components/footer.component/footer';
import PortfolioItemComponent from '../../components/portfolio.item.component/portfolio.item';
/* JSON */
import portfolioData from '../../data/portfolio.item.json';

class Homepage extends React.Component {

    /**
     * @function render
     * @desc renders the content for the class
     * @author Anselm Marie
     * @memberOf Homepage
     */
    render() {

        return (

            <Fragment>

                <HeroComponent />

                <div className="container skills-container">
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
                    <div className="row">
                        {portfolioData.data.map((data, index) => {
                            return <PortfolioItemComponent key={index} item={data} history={this.props.history} />
                        })}
                    </div>
                </div>

                <FooterComponent />


            </Fragment>

        );
    }

}

export default Homepage;
