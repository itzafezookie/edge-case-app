import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CubeImage from './components/CubeImage';
import CommutatorGenerator from './components/CommutatorGenerator';
import AlgorithmGrid from './components/AlgorithmGrid';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import './App.css';

import ollData from './data/oll.json';
import pllData from './data/pll.json';
import parityData from './data/parity.json';
import FinalEdgeParityControls from './components/FinalEdgeParityControls';

import { translateAlgorithm } from './utils/notation';
import { generateFinalEdgeParityMap, generateFinalEdgeParityAlgo } from './utils/generators';

function App() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [cubeSize, setCubeSize] = useState(4); // Default to 4x4
  const [activeParityEdge, setActiveParityEdge] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState(null);

  const scrollContainerRef = useRef(null);
  const cardRefs = useRef({});

  const algorithmData = {
    oll: ollData,
    pll: pllData,
    parity: parityData,
    'com-gen': [],
  };

  const isEven = cubeSize % 2 === 0;
  const currentAlgs = algorithmData[activeCategory]?.filter(alg => {
    if (alg.validFor === 'even' && !isEven) {
      return false;
    }
    if (alg.validFor === 'odd' && isEven) {
      return false;
    }
    if (alg.imageIdentifier === 'FinalEdgeParity' && cubeSize < 5) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (viewMode === 'detail' && selectedAlgorithmId) {
      const cardElement = cardRefs.current[selectedAlgorithmId];
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
    if (viewMode === 'grid' && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [viewMode, selectedAlgorithmId, activeCategory]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (category === 'com-gen') {
      setViewMode('detail');
    } else {
      setViewMode('grid');
    }
  };

  const handleHomeClick = () => {
    setActiveCategory('home');
  };

  const handleAlgorithmSelect = (imageIdentifier) => {
    setSelectedAlgorithmId(imageIdentifier);
    setViewMode('detail');
  };

  const handleBackToLibrary = () => {
    setViewMode('grid');
    setSelectedAlgorithmId(null);
  };

  return (
    <div className="App">
      <Header onHomeClick={handleHomeClick} />
      <main className={`main-content ${viewMode === 'grid' ? 'grid-view' : ''} ${activeCategory === 'home' ? 'home-view' : ''}`} ref={scrollContainerRef}>
        {activeCategory === 'home' ? (
          <HomePage onCategorySelect={handleCategorySelect} cubeSize={cubeSize} />
        ) : viewMode === 'grid' && activeCategory !== 'com-gen' ? (
          <AlgorithmGrid algorithms={currentAlgs} onAlgorithmSelect={handleAlgorithmSelect} cubeSize={cubeSize} />
        ) : activeCategory === 'com-gen' ? (
          <CommutatorGenerator cubeSize={cubeSize} />
        ) : (
          currentAlgs && currentAlgs.map((alg, index) => {
            return (
              <div 
                key={alg.caseName} 
                id={alg.caseName} 
                className="card-container"
                ref={el => (cardRefs.current[alg.imageIdentifier] = el)}
              >
                <div className="alg-card">
                  {/* Add the CubeImage component */}
                  {alg.visualization && alg.visualization.generator === 'finalEdgeParity' ? (
                    <div className="alg-visualization">
                      <CubeImage
                        viewType={alg.visualization.viewType}
                        size={cubeSize}
                        colorMap={generateFinalEdgeParityMap()}
                        stretchModes={alg.visualization.stretchModes}
                        activeParityEdge={activeParityEdge}
                      />
                    </div>
                  ) : alg.visualization && (
                    <div className="alg-visualization">
                      <CubeImage
                        viewType={alg.visualization.viewType}
                        size={cubeSize} // Use global cube size
                        colorMap={alg.visualization.colorMap}
                        arrows={alg.visualization.arrows}
                        stretchModes={alg.visualization.stretchModes}
                      />
                    </div>
                  )}
                  <div className="alg-info">
                    <h3>{alg.caseName}</h3>
                    {alg.visualization && alg.visualization.generator === 'finalEdgeParity' && (
                      <FinalEdgeParityControls
                        cubeSize={cubeSize}
                        activeParityEdge={activeParityEdge}
                        setActiveParityEdge={setActiveParityEdge}
                      />
                    )}
                    <div className="algorithm-notation">
                      {translateAlgorithm(
                        alg.visualization && alg.visualization.generator === 'finalEdgeParity'
                          ? generateFinalEdgeParityAlgo(cubeSize, activeParityEdge)
                          : alg.algorithm || (alg.algorithms && alg.algorithms['4x4']),
                        cubeSize,
                        alg.baseSize
                      )
                        .split('*')
                        .map((line, index) => (
                          <p key={index}>{line.trim()}</p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
      <Footer 
        cubeSize={cubeSize} 
        setCubeSize={setCubeSize} 
        viewMode={viewMode}
        onBackToLibrary={handleBackToLibrary}
        activeCategory={activeCategory}
      />
    </div>
  );
}

export default App;
