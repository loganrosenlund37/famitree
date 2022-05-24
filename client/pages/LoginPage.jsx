/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useContext } from 'react';
import axios from 'axios';
import AppContext from '../components/AppContext';
import useInput from '../hooks/useInput';
import useDocumentTitle from '../hooks/useDocumentTitle';

const LoginPage = () => {
  const { logoutMessage, setLogoutMessage, setLoggedIn } = useContext(AppContext);
  const { value: username, bind: bindUsername } = useInput('bob.moose');
  const { value: password, bind: bindPassword } = useInput('********');

  useDocumentTitle(' - Login');
  const resetMessage = () => {
    window.setTimeout(() => {
      setLogoutMessage('');
    }, 1_500);
  };

  useEffect(() => {
    resetMessage();
  }, []);

  const login = async (e) => {
    e.preventDefault();
    const { data: auth } = await axios.post('api/login', {
      username,
      password,
    });
    if (auth === true) {
      setLoggedIn(true);
      localStorage.setItem('loggedIn', true);
    } else {
      setLogoutMessage(auth);
      resetMessage();
    }
  };

  return (
    <div className="flex w-full bg-slate-300 min-h-screen justify-center items-center">
      <form onSubmit={login} className="flex flex-col bg-white border-4 border-double border-gray-400 rounded-md items-center p-6 m-4" autoComplete="off">
        <p className="text-3xl text-slate-700 mb-7">Famitree</p>
        <p className="mb-3 flex flex-col sm:flex-row text-center">
          <label htmlFor="username">
            Username
            <input className="inpt w-full" type="text" id="username" {...bindUsername} />
          </label>
        </p>
        <p className="mb-3 flex flex-col sm:flex-row text-center">
          <label htmlFor="password" className="">
            Password
            <input className="inpt w-full" type="text" id="password" {...bindPassword} />
          </label>
        </p>
        <p className="text-red-600">{logoutMessage}</p>
        <button type="submit" className={`btn w-full ${logoutMessage.length > 0 ? 'mt-5' : 'mt-11'}`}>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
