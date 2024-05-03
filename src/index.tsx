import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51HL8IJF63U4SABg9W9u1Jzp8SwN8W5Qz9mzNwiVTarsWGSR5u8v0vCGMZS7U2aN9pXNq9LvfzyZodA6SgdirDwsb00UV8jO1Lg')

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

  <Router>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </Router>

);
