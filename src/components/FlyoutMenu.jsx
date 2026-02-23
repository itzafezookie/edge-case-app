import React, { useState, useRef, useEffect } from 'react';
import './FlyoutMenu.css';

const FlyoutMenu = ({ activeCategory, onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef();

  const handleNav = (category) => {
    onNavClick(category);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (node.current.contains(e.target)) {
        // inside click
        return;
      }
      // outside click 
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={node} className="flyout-menu">
      <button onClick={() => setIsOpen(!isOpen)} className="flyout-button">
        &#9776; {/* Hamburger Icon */}
      </button>
      <div className={`flyout-content ${isOpen ? 'show' : ''}`}>
        <a onClick={() => handleNav('oll')} className={activeCategory === 'oll' ? 'active' : ''}>OLL</a>
        <a onClick={() => handleNav('pll')} className={activeCategory === 'pll' ? 'active' : ''}>PLL</a>
        <a onClick={() => handleNav('parity')} className={activeCategory === 'parity' ? 'active' : ''}>Parity+</a>
        <a onClick={() => handleNav('com-gen')} className={activeCategory === 'com-gen' ? 'active' : ''}>Com-Gen</a>
      </div>
    </div>
  );
};

export default FlyoutMenu;
