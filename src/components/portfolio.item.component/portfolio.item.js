/* Node Modules */
import React from "react";
/* Component Styles */
import './portfolio.item.css';
/* Modules */
import {updatePortfolio} from '../../data/store';

/**
 * @function goToPortfolio
 * @desc updates the portfolio store then
 * @author Anselm Marie
 * @param {object} history - react router history contents
 * @param {object} item - the contents of the item clicked
 */
const goToPortfolio = (history, item) => {
    updatePortfolio(item);
    history.push(`/portfolio/${item.url}`);
};

/**
 * @function getImagePath
 * @desc getting the full image path
 * @author Anselm Marie
 * @param {string} thumbnail - part of the thumbnail file path
 * @return {string}
 */
const getImagePath = (thumbnail) => {
    let path;

    try {
        path = require(`../../assets/images/portfolio/${thumbnail}`);
    }
    catch (e) {
        path = '';
    }

    return path;
};

export default (props) => {

    const item = props.item;

    return (

        <div onClick={() => goToPortfolio(props.history, props.item)} className="portfolio-item">
            <div className="image-style" style={{backgroundImage: `url(${getImagePath(item.thumbnail)}`}}>
                <div className="bg-fade">
                    <div className="row portfolio-row">

                        <div className="portfolio-content">
                            <h4>{item.title}</h4>
                            <h5>{item.subtitle}</h5>
                            <h6>{item.company}</h6>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}