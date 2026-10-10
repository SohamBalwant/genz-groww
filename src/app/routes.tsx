import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../components/layout/AppShell';
import { Home } from '../pages/Home';
import { News } from '../pages/News';
import { NewsDetail } from '../pages/NewsDetail';
import { EventPage } from '../pages/EventPage';
import { InstrumentDetail } from '../pages/InstrumentDetail';
import { OrderTicketPage } from '../pages/OrderTicketPage';
import { OrderReviewPage } from '../pages/OrderReviewPage';
import { OrderResultPage } from '../pages/OrderResultPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { OptionsLabPage } from '../pages/OptionsLabPage';
import { OrdersPage } from '../pages/OrdersPage';
import { LearnPage } from '../pages/LearnPage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFound } from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'news',
        element: <News />,
      },
      {
        path: 'news/:id',
        element: <NewsDetail />,
      },
      {
        path: 'event/:id',
        element: <EventPage />,
      },
      {
        path: 'instrument/:id',
        element: <InstrumentDetail />,
      },
      {
        path: 'instrument/:id/options',
        element: <Navigate to="../?tab=options" replace />,
      },
      {
        path: 'order/:instrumentId',
        element: <OrderTicketPage />,
      },
      {
        path: 'order/review',
        element: <OrderReviewPage />,
      },
      {
        path: 'order/result/:id',
        element: <OrderResultPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'options',
        element: <OptionsLabPage />,
      },
      {
        path: 'watchlist',
        element: <Navigate to="/options" replace />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'learn',
        element: <LearnPage />,
      },
      {
        path: 'learn/qa',
        element: <Navigate to="/learn?tab=qa" replace />,
      },
      {
        path: 'learn/quizzes',
        element: <Navigate to="/learn?tab=quizzes" replace />,
      },
      {
        path: 'learn/concepts',
        element: <Navigate to="/learn?tab=paths" replace />,
      },
      {
        path: 'learn/milestones',
        element: <Navigate to="/learn?tab=paths" replace />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
