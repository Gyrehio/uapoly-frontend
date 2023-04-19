import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import SignUpPage from './components/SignUpPage.tsx';
import HomePage from './components/HomePage.tsx';
import UserPage from './components/UserPage.tsx';
import Loading from './components/Loading.tsx';
import AccountSettings from './components/AccountSettings.tsx';
import FriendPage from './components/FriendPage.tsx';

const App =()=>{
  return (
    <Router>
      <div className='App'>
        <div className='container'>
          <Routes>
            <Route exact path='/' Component={HomePage} />
            <Route exact path='/signup' Component={SignUpPage} /> 
            <Route exact path='/home' Component={UserPage} />
            <Route exact path='/test' Component={Loading}/>
            <Route exact path='/user' Component={AccountSettings} />
            <Route exact path='/friends' Component={FriendPage} />
          </Routes>
        </div>
      </div>
    </Router>
  )};
export default App;