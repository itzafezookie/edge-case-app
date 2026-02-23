import React from 'react';
import CubeImage from './CubeImage';
import './AlgorithmGrid.css';

const AlgorithmGrid = ({ algorithms, onAlgorithmSelect }) => {
  return (
    <div className="grid-container">
      {algorithms.map((alg, index) => (
        <div key={alg.caseName} className="grid-item" onClick={() => onAlgorithmSelect(alg.imageIdentifier)}>
          <div className="grid-item-image">
            <CubeImage
              viewType={alg.visualization.viewType}
              size={alg.visualization.libraryPreview ? alg.visualization.libraryPreview.size : (alg.baseSize || 4)}
              colorMap={alg.visualization.libraryPreview ? alg.visualization.libraryPreview.colorMap : alg.visualization.colorMap}
              arrows={alg.visualization.arrows}
              stretchModes={alg.visualization.libraryPreview ? null : alg.visualization.stretchModes}
            />
          </div>
          <div className="grid-item-name">{alg.caseName}</div>
        </div>
      ))}
    </div>
  );
};

export default AlgorithmGrid;