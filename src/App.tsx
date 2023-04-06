import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import SignInPage from './components/SignInPage.tsx'
import HomePage from './components/HomePage.tsx';

const App =()=>{
  return (
    <Router>
      <div className='App'>
        <div className='container'>
          <Routes>
            <Route exact path='/' Component={HomePage} />
            <Route exact path='/signin' Component={SignInPage} /> 
            {/*<Route
              exact
              path='/widgets'
              render={(props)=>
                <Fragment>
              
                  <Widgets prods={widgetprods}/>
                
                </Fragment>
              }
            />
          <Route
            exact
            path='/wudgets'
            render={(props)=>
              <Fragment>
            
                <Wudgets prods={wudgetprods}/>
              
              </Fragment>
            }
          />*/}
          </Routes>
        </div>
      </div>
    </Router>
  )};
export default App;