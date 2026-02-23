import React from 'react';
import './Footer.css';

const Footer = ({ cubeSize, setCubeSize, viewMode, onBackToLibrary, activeCategory }) => {
  const handleSizeChange = (e) => {
    setCubeSize(Number(e.target.value));
  };

  const sizeOptions = Array.from({ length: 12 }, (_, i) => i + 4); // 4 to 15

  return (
    <footer className="app-footer">
      {viewMode === 'detail' && activeCategory !== 'com-gen' && activeCategory !== 'home' && (
        <button onClick={onBackToLibrary} className="back-to-library-btn">
          &larr; Back to Library
        </button>
      )}
      <div className="cube-size-selector-container">
        <label htmlFor="cube-size-selector">Size:</label>
        <select
          id="cube-size-selector"
          className="cube-size-selector"
          value={cubeSize}
          onChange={handleSizeChange}
        >
          {sizeOptions.map(size => (
            <option key={size} value={size}>{size}x{size}</option>
          ))}
        </select>
      </div>
    </footer>
  );
};

export default Footer;
