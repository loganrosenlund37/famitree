import React, { useState, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppContext from './components/AppContext';
import Spinner from './components/Spinner';

const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const Navbar = React.lazy(() => import('./components/Navbar'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Forest = React.lazy(() => import('./pages/Forest'));
const LeafPage = React.lazy(() => import('./pages/LeafPage'));

const App = () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn'));
  const [logoutMessage, setLogoutMessage] = useState('');
  const value = useMemo(() => ({
    loggedIn, setLoggedIn, logoutMessage, setLogoutMessage,
  }), [loggedIn, logoutMessage]);

  return (
    <AppContext.Provider value={value}>
      <React.Suspense fallback={<Spinner />}>
        {
          loggedIn
            ? (
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Forest />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/leaf" element={<LeafPage />} />
                </Routes>
              </>
            )
            : <LoginPage />
        }
      </React.Suspense>
    </AppContext.Provider>
  );
};

export default App;
