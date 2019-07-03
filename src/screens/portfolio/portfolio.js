/* Node Modules */
import React, {Fragment} from 'react';
import DOMPurify from 'dompurify';
/* Modules */
import {trackScreen} from "../../modules/track.module/track";
import {getPortfolio, clearPortfolio} from "../../data/store.data/store";
/* Components */
import FooterComponent from "../../components/footer.component/footer";
/* Data */
import portJson from '../../data/portfolio.item.json';
/* Component Styles */
import './portfolio.css';
import {NavLink} from "react-router-dom";
/* Other */
const config = {
    ADD_ATTR: ['target'],
};
const homepageLink = '< Homepage';

class Portfolio extends React.Component {

    /**
     * @property constructor
     * @desc init the lexical state
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    state = {
        item: null
    };

    /**
     * @function componentDidMount
     * @desc init function once the component mounts
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    componentDidMount() {
        window.scrollTo(0, 0);
        this.checkItem();
        trackScreen();
    }

    /**
     * @function componentDidMount
     * @desc init function once the component unMounts
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    componentWillUnmount() {
        clearPortfolio();
    }

    /**
     * @function getContent
     * @desc returns the data that matches part of the url
     * @author Anselm Marie
     * @memberOf Portfolio
     * @return {object}
     */
    getContent() {
        const url = `${this.props.match.params.company}/${this.props.match.params.project}`;
        return portJson.data.find((el) => {
            return el.url === url;
        });
    }

    /**
     * @function checkItem
     * @desc update the state with the current portfolio
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    checkItem() {
        let item = getPortfolio();

        /* If the data doesn't exist the application will try to manually get the data */
        if (!item) {
            item = this.getContent();
        }

        /* If the data still doesn't exist then redirect to the error screen */
        if (!item) {
            this.props.history.push(`/404`);
        }

        this.setState({
            item: item
        });

    }

    /**
     * @function render
     * @desc renders the content for the class
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    render() {

        if (!this.state.item) {
            return <p>loading....</p>
        }

        return (

            <Fragment>

                <div className="portfolio-nav-bg">
                    <nav className="container portfolio-nav-container">
                        <NavLink to="/">{homepageLink}</NavLink>
                    </nav>
                </div>

                <div className="portfolio-header-bg">
                    <header className="container portfolio-header-container">
                        <h1>{this.state.item.title}</h1>
                        <h2>{this.state.item.subtitle}</h2>
                        {/*<h3>{this.state.item.company}</h3>*/}
                    </header>
                </div>

                <div className="container">
                    <p className="portfolio-description" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(this.state.item.description, config)}}></p>

                    {this.state.item.videos &&
                    <div className="videos-container">
                        {this.state.item.videos.map((data, index) => {
                            return (
                                <div
                                    className="portfolio-video"
                                    key={index}>
                                    <p>{data.description}</p>
                                    <iframe
                                        width="560"
                                        height="315"
                                        title={data.title}
                                        src={data.src}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen></iframe>
                                </div>
                            )
                        })}
                    </div>}

                    <div className="image-container">
                        {this.state.item.images.map((data, index) => <img className="portfolio-image" src={require(`../../assets/images/portfolio/${data.src}`)} alt={data.alt} key={index} /> )}
                    </div>
                </div>

                <FooterComponent />

            </Fragment>
        );
    }

}

export default Portfolio;
