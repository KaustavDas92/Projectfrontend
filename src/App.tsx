import React from 'react';

import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { oktaConfig } from './lib/OktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js'
import { Security,LoginCallback } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import ReviewListPage from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import ShelfPage from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';

const oktaAuth = new OktaAuth(oktaConfig)
export const App = () => {

  const navigate = useNavigate()
  
  const customAuthHandler = () => {
    navigate("/login")
  }

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || "/", window.location.origin), { replace: true })
  }
  return (
    <>

        <div className='d-flex flex-column min-vh-100'>
          <Security 
            oktaAuth={oktaAuth} 
            restoreOriginalUri={restoreOriginalUri}
            onAuthRequired={customAuthHandler}>
            <Navbar />
            <div className='flex-grow-1'>
              <Routes>
                
                {/* <Route path='/login/callback' element={<LoginWidget config={oktaConfig} />}  /> */}
                <Route path="/" Component={HomePage} />
                <Route path="/home" Component={HomePage} />
                <Route path="/search" Component={SearchBooksPage} />
                <Route path="/checkout/:bookid" Component={BookCheckoutPage} />

                <Route path='/login' element={<LoginWidget config={oktaConfig}/>}  />

                <Route path='/reviewList/:bookid' Component={ReviewListPage} />
                <Route path='/shelf' Component={ShelfPage} />
                <Route path='/messages' Component={MessagesPage} />
              </Routes>
            </div>
            <Footer />
          </Security>
        </div>
      {/* <HomePage />
        <SearchBooksPage/> */}
      {/* <Navigation /> */}
    </>
  );
}

