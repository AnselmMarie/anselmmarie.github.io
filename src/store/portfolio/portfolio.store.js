let store = {
  portfolio: null,
};

export const updatePortfolio = (item) => {
  if (!item || typeof item !== 'object') {
    console.log('Item is not an object');
    return;
  }

  store.portfolio = item;
};

export const getPortfolio = () => {
  return store.portfolio;
};

export const clearPortfolio = () => {
  store.portfolio = null;
};
