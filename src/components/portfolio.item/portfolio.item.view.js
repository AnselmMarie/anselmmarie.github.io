import React from 'react';

import { updatePortfolio } from '../../data.store/store';

import './portfolio.item.styles.css';

const PortfolioItemView = ({ item, history }) => {

    const goToPortfolio = (history, item) => {
        updatePortfolio(item);
        history.push(`/portfolio/${item.url}`);
    };

    const getImagePath = (thumbnail) => {
        let path;

        try {
            path = require(`../../assets/images/portfolio/${thumbnail}`);
        } catch (e) {
            path = '';
        }

        return path.default;
    };

    return (
        <div onClick={() => goToPortfolio(history, item)} className="portfolio-item">
            <div className="image-style" style={{ backgroundImage: `url(${getImagePath(item.thumbnail)}` }}>
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
    );
}

export default PortfolioItemView;