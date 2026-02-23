import React, { useEffect } from 'react';

const FinalEdgeParityControls = ({ cubeSize, activeParityEdge, setActiveParityEdge }) => {
  const maxGroups = Math.floor((cubeSize - 2) / 2);

  useEffect(() => {
    const isEven = cubeSize % 2 === 0;
    // For even cubes, we remove the last option (flipping all inner edges)
    const numOptions = isEven ? maxGroups - 1 : maxGroups;
    // Value is 1-indexed, so max value is numOptions
    if (activeParityEdge > numOptions && numOptions > 0) {
      setActiveParityEdge(1);
    }
  }, [cubeSize, activeParityEdge, setActiveParityEdge, maxGroups]);

  const options = [];
  for (let i = 0; i < maxGroups; i++) {
    const numEdges = i * 2 + (cubeSize % 2 === 0 ? 2 : 1);
    // You would never need to flip the entire set of inner edges
    if (numEdges >= cubeSize - 2) {
      continue;
    }
    options.push(
      <option key={i} value={i + 1}>
        {`Center ${numEdges} Edge${numEdges > 1 ? 's' : ''}`}
      </option>
    );
  }

  return (
    <div className="final-edge-parity-controls">
      <select
        value={activeParityEdge}
        onChange={(e) => setActiveParityEdge(parseInt(e.target.value, 10))}
      >
        {options}
      </select>
    </div>
  );
};

export default FinalEdgeParityControls;