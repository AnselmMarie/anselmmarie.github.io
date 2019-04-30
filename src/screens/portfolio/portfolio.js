/* Node Modules */
import React, {Fragment} from 'react';
/* Modules */
import {getPortfolio} from "../../data/store";
/* Data */
import portJson from '../../data/portfolio.item.json';
/* Component Styles */
import './portfolio.css';
import FooterComponent from "../../components/footer.component/footer";

class Portfolio extends React.Component {

    /**
     * @function constructor
     * @desc create a local state to store information
     * @author Anselm Marie
     * @memberOf Portfolio
     * @param {object} props - properties that are being used for the screen
     */
    constructor(props) {
        super(props);
        this.state = {
            item: null
        };
    }

    /**
     * @function componentDidMount
     * @desc init function once the component mounts
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    componentDidMount() {
        this.checkItem();
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

                <div className="container-fluid portfolio-header-container">
                    <header className="container">
                        <h1>{this.state.item.title}</h1>
                        <h2>{this.state.item.subtitle}</h2>
                        {/*<h3>{this.state.item.company}</h3>*/}
                    </header>
                </div>

                <div className="container">
                    <p className="portfolio-description">{this.state.item.description}</p>
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
