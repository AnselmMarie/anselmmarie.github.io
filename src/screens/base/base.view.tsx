import { ReactElement } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import UiFooter from '../../ui/footer';

import HomepageScreen from '../homepage';
import PortfolioScreen from '../portfolio';
import NoMatchScreen from '../no.match';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomepageScreen />,
  },
  {
    path: '/portfolio/:company/:project',
    element: <PortfolioScreen />,
  },
  {
    element: <NoMatchScreen />,
  },
]);

const BaseView = (): ReactElement => (
  <>
    <RouterProvider router={router} />
    <UiFooter />
  </>
);

export default BaseView;
