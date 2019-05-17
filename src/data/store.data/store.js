let store = {
    portfolio: null,
};

/**
 * @function updatePortfolio
 * @desc updates the portfolio store
 * @author Anselm Marie
 * @param {object} item - the contents of the item clicked
 */
export const updatePortfolio = (item) => {
    if (!item || typeof item !== 'object') {
        console.log('Item is not an object');
        return;
    }

    store.portfolio = item;
};

/**
 * @function getPortfolio
 * @desc return current portfolio content
 * @author Anselm Marie
 * @return {object}
 */
export const getPortfolio = () => {
    return store.portfolio;
};

/**
 * @function clearPortfolio
 * @desc clear the portfolio content
 * @author Anselm Marie
 */
export const clearPortfolio = () => {
    store.portfolio = null;
};