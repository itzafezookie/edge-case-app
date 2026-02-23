import React from 'react';
import './Header.css';
import logo from './EdgeCase Logo.svg'; // Import the logo

const Header = ({ onHomeClick }) => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <img src={logo} alt="EdgeCase Logo" className="logo" />
      </div>
      <button onClick={onHomeClick} className="home-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28px" height="28px">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </button>
    </header>
  );
};

export default Header;
