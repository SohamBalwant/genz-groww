import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import { router } from './app/routes';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
};

export default App;
