import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import AppContext from './AppContext';

function Navbar() {
  const { setLoggedIn, setLogoutMessage } = useContext(AppContext);
  const logout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    setLogoutMessage('You have been logged out.');
  };

  return (
    <nav className="flex flex-row p-3 bg-slate-300">
      <ul className="flex flex-row justify-between">
        <li className="mr-3"><NavLink to="./" className="text-link">Home</NavLink></li>
        <li className=""><NavLink to="./settings" className="text-link">Settings</NavLink></li>
      </ul>
      <ul className="ml-auto">
        <li className=""><NavLink to="" className="text-link"><button type="button" onClick={logout} className="logout-button">Logout</button></NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
