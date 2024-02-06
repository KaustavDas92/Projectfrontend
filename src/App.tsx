import React from 'react';

import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Navigation } from './AppRouter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';

export const App = () => {
  return (
    <>
      <Router>
        <div className='d-flex flex-column min-vh-100'>
          <Navbar />
          <div className='flex-grow-1'>
            <Routes>

              <Route path="/" Component={HomePage} />
              <Route path="/home" Component={HomePage} />
              <Route path="/search" Component={SearchBooksPage} />
              <Route path="/checkout/:bookid" Component={BookCheckoutPage} />


            </Routes>

          </div>
          <Footer />

        </div>
      </Router>
      {/* <HomePage />
        <SearchBooksPage/> */}
      {/* <Navigation /> */}
    </>
  );
}

