import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { NavLink } from 'react-router-dom';

import { trackScreen } from "../../modules/track/track.module";
import { getPortfolio, clearPortfolio } from "../../data.store/store";
import FooterComponent from "../../components/footer";
import portJson from '../../config/portfolio.item.json';

import './portfolio.styles.css';

const config = {
    ADD_ATTR: ['target'],
};
const homepageLink = '< Homepage';

const PortfolioView = ({ match, history }) => {

    const [item, setItem] = useState(null);

    const getContent = () => {
        const params = match.params;
        const url = `${params.company}/${params.project}`;
        return portJson.data.find((el) => {
            return el.url === url;
        });
    }

    const checkItem = () => {
        let item = getPortfolio();

        /* If the data doesn't exist the application will try to manually get the data */
        if (!item) {
            item = getContent();
        }

        /* If the data still doesn't exist then redirect to the error screen */
        if (!item) {
            history.push(`/404`);
        }

        setItem(item);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        checkItem();
        trackScreen();

        return () => {
            clearPortfolio();
        }
    }, []);

    if (!item) {
        return <p>loading....</p>
    }

    return (
        <>
            <div className="portfolio-nav-bg">
                <nav className="container portfolio-nav-container">
                    <NavLink to="/">{homepageLink}</NavLink>
                </nav>
            </div>

            <div className="portfolio-header-bg">
                <header className="container portfolio-header-container">
                    <h1>{item.title}</h1>
                    <h2>{item.subtitle}</h2>
                </header>
            </div>

            <div className="container">
                <p className="portfolio-description" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description, config) }}></p>

                {item.videos &&
                    <div className="videos-container">
                        {item.videos.map((data, index) => {
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
                            );
                        })}
                    </div>}

                <div className="image-container">
                    {item.images.map((data, index) => <img className="portfolio-image" src={require(`../../assets/images/portfolio/${data.src}`).default} alt={data.alt} key={index} />)}
                </div>
            </div>

            <FooterComponent />
        </>
    );
};

export default PortfolioView;
