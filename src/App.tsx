import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import ErrorBoundary from '@/components/common/ErrorBoundary';

import routes from './routes';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <IntersectObserver />
      <div className="h-screen w-screen overflow-hidden">
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Toaster />
    </ErrorBoundary>
  );
};

export default App;
