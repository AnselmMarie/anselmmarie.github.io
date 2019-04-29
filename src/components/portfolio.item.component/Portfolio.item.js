/* Node Modules */
import React from "react";
/* Component Styles */
import './portfolio.item.css';

export default (props) => {

    const item = props.item;

    return (

        <div className="portfolio-item">
            <div className="image-style" style={{backgroundImage: `url(${item.portfolioImage})`}}>
                <div className="bg-fade">
                    <div className="row portfolio-row">

                        <div className="portfolio-content">
                            <h4>{item.title}</h4>
                            <h5>{item.subTitle}</h5>
                            <h6>{item.company}</h6>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}