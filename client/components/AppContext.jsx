import React from 'react';

const AppContext = React.createContext({
  logoutMessage: '',
  loggedIn: false,
  setLoggedIn: () => {},
});

export default AppContext;
