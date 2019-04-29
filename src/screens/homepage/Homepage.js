/* Node Modules */
import React, {Fragment} from 'react';
import './homepage.css';
/* Components */
import HeroComponent from '../../components/hero.component/Hero';
import FooterComponent from '../../components/footer.component/Footer';

class Homepage extends React.Component {

    /**
     * @function componentDidMount
     * @desc init function once the component mounts
     * @author Anselm Marie
     * @memberOf Homepage
     */
    componentDidMount() {
        console.log('componentDidMount');
    }

    /**
     * @function componentDidMount
     * @desc init function once the component unMounts
     * @author Anselm Marie
     * @memberOf Homepage
     */
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }

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

                <div className="container">
                    <div className="row">

                        <div className="col-xs-12 col-md">
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

                        <div className="col-xs-12 col-md">
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

                <div className="container">
                    <h3>My Work</h3>
                    <div className="portfolio-item">
                        <div className="portfolio-content">
                            <h4>Title</h4>
                            <h5>SubTitle</h5>
                        </div>
                    </div>
                </div>

                <FooterComponent />


            </Fragment>

        );
    }

}

export default Homepage;
