/* Node Modules */
import React, {Fragment} from 'react';
/* Modules */
import {getPortfolio} from "../../modules/store";

class Portfolio extends React.Component {

    /**
     * @function render
     * @desc renders the content for the class
     * @author Anselm Marie
     * @memberOf Portfolio
     */
    render() {
        const item = getPortfolio();
        
        return (

            <Fragment>

                <div className="container-fluid">
                    <header>
                        <h1>{item.title}</h1>
                        <h2>{item.subtitle}</h2>
                        <h2>{item.company}</h2>
                    </header>
                </div>

                <div className="container">
                    <p>{item.description}</p>
                    {item.images.map((src, index) => <img className="portfolio-image" src={require(`../../assets/images/portfolio/${src}`)} key={index} /> )}
                </div>

            </Fragment>
        );
    }

}

export default Portfolio;
