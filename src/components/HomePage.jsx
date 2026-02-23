import React, { useState, useEffect } from 'react';
import HomeCubeImage from './HomeCubeImage';
import './HomePage.css';

const HomePage = ({ onCategorySelect, cubeSize }) => {
  const [randomColorMap, setRandomColorMap] = useState(null);

  const colors = ['Y', 'W', 'B', 'G', 'R', 'O'];

  const generateRandomColorMap = (size) => {
    const newColorMap = { top: [], front: [], right: [] };

    for (const face of ['top', 'front', 'right']) {
      for (let i = 0; i < size; i++) {
        let row = '';
        for (let j = 0; j < size; j++) {
          row += colors[Math.floor(Math.random() * colors.length)];
        }
        newColorMap[face].push(row);
      }
    }
    return newColorMap;
  };

  useEffect(() => {
    setRandomColorMap(generateRandomColorMap(cubeSize));
  }, [cubeSize]);

  return (
    <div className="home-page-container">
      <div className="home-cube-container">
        {randomColorMap && (
          <HomeCubeImage
                size={cubeSize}
                colorMap={randomColorMap}
              />
        )}
      </div>
      <button onClick={() => onCategorySelect('oll')} className="category-button">
        OLL Algorithms
      </button>
      <button onClick={() => onCategorySelect('pll')} className="category-button">
        PLL Algorithms
      </button>
      <button onClick={() => onCategorySelect('parity')} className="category-button">
        Parity+ Algorithms
      </button>
      <button onClick={() => onCategorySelect('com-gen')} className="category-button">
        Commutator
      </button>
    </div>
  );
};

export default HomePage;