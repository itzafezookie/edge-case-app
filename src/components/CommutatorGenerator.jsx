import React, { useState, useEffect } from 'react';
import './CommutatorGenerator.css';

const COLORS = {
  Y: '#e9cc2bff', // Yellow
  W: '#ebe6d2ff', // White
  B: '#00aeef', // Blue
  G: '#6fcf21ff', // Green
  R: '#f15a29', // Red
  O: '#e25c13ff', // Orange
  X: '#454545', // Gray for non-visible/other faces
};

const CORNER_PERCENTAGES = {
  4: 0.26,
  5: 0.22,
  6: 0.20,
  7: 0.20,
  8: 0.19,
  9: 0.18,
};

const getCornerPercent = (size) => {
  if (CORNER_PERCENTAGES[size]) {
    return CORNER_PERCENTAGES[size];
  }
  if (size < 4) {
    return 0.26; // Default for smaller sizes
  }
  // Linear interpolation for sizes > 9
  return Math.max(0.1, 0.18 - (size - 9) * 0.005);
};

const getInverseMove = (move) => {
  if (!move) return '';
  if (move.endsWith("'")) {
    return move.slice(0, -1);
  }
  return `${move}'`;
};

const generateSliceNotation = (cols, innerGridSize) => {
  if (cols.size === 0) return '';

  const sortedCols = [...cols].sort((a, b) => a - b);
  const center = (innerGridSize - 1) / 2;

  let leftCount = 0;
  let rightCount = 0;
  sortedCols.forEach(col => {
    if (col < center) leftCount++;
    if (col > center) rightCount++;
    // For odd cubes, the center column counts for both
    if (innerGridSize % 2 !== 0 && col === center) {
      leftCount++;
      rightCount++;
    }
  });

  let moveType;
  if (leftCount > rightCount) moveType = 'l';
  else if (rightCount > leftCount) moveType = "r'";
  else moveType = 'm';

  const minCol = sortedCols[0];
  const maxCol = sortedCols[sortedCols.length - 1];

  if (moveType === 'l') {
    const sliceNum = maxCol + 2;
    if (cols.size === 1) {
      return `${sliceNum}l`;
    }
    const startSlice = minCol + 2;
    return `[${startSlice}-${sliceNum}]l`;
  }

  if (moveType === "r'") {
    const sliceNum = innerGridSize - minCol + 1;
    if (cols.size === 1) {
      return `${sliceNum}r'`;
    }
    const startSlice = innerGridSize - maxCol + 1;
    return `[${startSlice}-${sliceNum}]r'`;
  }

  if (moveType === 'm') {
    const sliceWidth = cols.size;
    return sliceWidth > 1 ? `${sliceWidth}m` : 'm';
  }

  return '';
};

const CommutatorGenerator = ({ cubeSize }) => {
  const [selectedStickers, setSelectedStickers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [isSelectionValid, setIsSelectionValid] = useState(true);
  const [algorithm, setAlgorithm] = useState('');
  const [debugOverlays, setDebugOverlays] = useState([]);
  const [lastInteractionData, setLastInteractionData] = useState(null);

  const handleReset = () => {
    setSelectedStickers([]);
    setIsDragging(false);
    setSelectionStart(null);
    setIsSelectionValid(true);
    setAlgorithm('');
    setDebugOverlays([]);
    setLastInteractionData(null);
  };

  useEffect(() => {
    handleReset();
  }, [cubeSize]);

  const size = cubeSize;
  const baseSize = 250;
  const width = baseSize;
  const height = baseSize;

  const cornerPercent = getCornerPercent(size);
  const cornerSize = baseSize * cornerPercent;
  const centerSize = size > 2 ? (baseSize - 2 * cornerSize) / (size - 2) : 0;
  const stickerGap = 14 / size;

  const gridPositions = [0];
  for (let i = 0; i < size; i++) {
    let sizeToAdd = (i === 0 || i === size - 1) ? cornerSize : centerSize;
    gridPositions.push(gridPositions[i] + sizeToAdd);
  }

  const runValidationAndSetState = (selection) => {
    if (selection.length === 0) {
      setIsSelectionValid(true);
      setDebugOverlays([]);
      setLastInteractionData(null);
      return;
    }

    const innerGridSize = size - 2;
    const startingZoneCols = new Set(selection.map(i => (i % size) - 1));
    const secondaryZoneRows = new Set(selection.map(i => Math.floor(i / size) - 1));

    const comparisonACols = new Set([...secondaryZoneRows]);
    const collisionA = [...startingZoneCols].some(col => comparisonACols.has(col));

    const comparisonBCols = new Set([...secondaryZoneRows].map(row => innerGridSize - 1 - row));
    const collisionB = [...startingZoneCols].some(col => comparisonBCols.has(col));
    
    const isValid = !(collisionA && collisionB);
    setIsSelectionValid(isValid);

    setLastInteractionData({ startingZoneCols, secondaryZoneRows, collisionA, collisionB, comparisonACols, comparisonBCols });

    const overlays = [];
    overlays.push({ type: 'start', cols: [...startingZoneCols], color: 'rgba(255, 255, 0, 0.35)' });
    overlays.push({ type: 'compareA', cols: [...comparisonACols], color: collisionA ? 'rgba(255, 0, 0, 0.35)' : 'rgba(0, 255, 0, 0.35)' });
    overlays.push({ type: 'compareB', cols: [...comparisonBCols], color: collisionB ? 'rgba(255, 0, 0, 0.35)' : 'rgba(0, 255, 0, 0.35)' });
    setDebugOverlays(overlays);
  };

  const handleMouseDown = (index, isOuter) => {
    if (isOuter) return;
    setIsDragging(true);
    setSelectionStart(index);
    const newSelection = [index];
    setSelectedStickers(newSelection);
    setAlgorithm('');
    runValidationAndSetState(newSelection);
  };

  const handleMouseEnter = (index, isOuter) => {
    if (!isDragging || isOuter) return;

    const startRow = Math.floor(selectionStart / size);
    const startCol = selectionStart % size;
    const endRow = Math.floor(index / size);
    const endCol = index % size;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    const newSelection = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (r > 0 && r < size - 1 && c > 0 && c < size - 1) {
          newSelection.push(r * size + c);
        }
      }
    }
    setSelectedStickers(newSelection);
    
    runValidationAndSetState(newSelection);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      if (isSelectionValid && lastInteractionData) {
        const { startingZoneCols, secondaryZoneRows, collisionA, collisionB, comparisonACols, comparisonBCols } = lastInteractionData;
        const innerGridSize = size - 2;

        // 1. Determine correct turn direction based on VALID path
        let turnDirection = 'F'; // Default for middle-slice case where both paths are valid
        if (!collisionA && collisionB) { // Path A (F' turn) is valid, Path B (F turn) is not.
          turnDirection = "F'";
        } else if (collisionA && !collisionB) { // Path B (F turn) is valid, Path A (F' turn) is not.
          turnDirection = 'F';
        }

        const move1 = generateSliceNotation(startingZoneCols, innerGridSize);
        const move2 = turnDirection;
        
        // 2. Select setup columns BASED ON the final turnDirection
        let secondaryCols;
        if (turnDirection === 'F') {
          secondaryCols = comparisonBCols; // Path B is for F turns
        } else { // turnDirection === "F'"
          secondaryCols = comparisonACols; // Path A is for F' turns
        }
        const move3 = generateSliceNotation(secondaryCols, innerGridSize);

        const move4 = getInverseMove(move2);
        const move5 = getInverseMove(move1);
        const move6 = move2;
        const move7 = getInverseMove(move3);
        const move8 = move4;

        const finalAlg = `(${move1} ${move2} ${move3} ${move4}) (${move5} ${move6} ${move7} ${move8})`;
        setAlgorithm(finalAlg);

      } else {
        setAlgorithm('Invalid selection. Cannot commutate.');
      }
    }
    setIsDragging(false);
    setSelectionStart(null);
    if (!isSelectionValid) {
        setTimeout(() => setDebugOverlays([]), 500); // Keep invalid overlays for a moment
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => handleMouseUp();
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, isSelectionValid, selectedStickers, size]);

  const stickers = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = r * size + c;
      const isOuterSticker = r === 0 || r === size - 1 || c === 0 || c === size - 1;
      const isSelected = selectedStickers.includes(i);
      let color = isOuterSticker ? 'X' : (isSelected ? (isSelectionValid ? 'B' : 'R') : 'W');
      
      const stickerW = gridPositions[c+1] - gridPositions[c] - stickerGap;
      const stickerH = gridPositions[r+1] - gridPositions[r] - stickerGap;
      const cornerRadius = Math.min(stickerW, stickerH) * 0.15;

      stickers.push(
        <rect
          key={`top-${i}`}
          x={gridPositions[c] + stickerGap / 2}
          y={gridPositions[r] + stickerGap / 2}
          width={stickerW}
          height={stickerH}
          fill={COLORS[color || 'X']}
          rx={cornerRadius}
          ry={cornerRadius}
          onMouseDown={() => handleMouseDown(i, isOuterSticker)}
          onMouseEnter={() => handleMouseEnter(i, isOuterSticker)}
          style={{ cursor: isOuterSticker ? 'default' : 'pointer' }}
        />
      );
    }
  }

  const renderedDebugOverlays = debugOverlays.flatMap(overlay => 
    overlay.cols.map((col, index) => {
      const x = gridPositions[col + 1] + stickerGap / 2;
      const y = gridPositions[1] + stickerGap / 2; // Start from the first inner row
      const w = gridPositions[col + 2] - gridPositions[col + 1] - stickerGap;
      const h = gridPositions[size - 1] - gridPositions[1] - stickerGap; // Span all inner rows
      return (
        <rect
          key={`${overlay.type}-${col}-${index}`}
          x={x}
          y={y}
          width={w}
          height={h}
          fill={overlay.color}
          style={{ pointerEvents: 'none' }}
        />
      );
    })
  );

  return (
    <div className="commutator-generator-container">
      <div className="alg-card">
        <div className="alg-visualization">
          <svg viewBox={`0 0 ${width} ${height}`} className="cube-image">
            {stickers}
            {renderedDebugOverlays}
          </svg>
        </div>
        <div className="alg-info">
          <p>{algorithm || 'Select stickers to create algorithm'}</p>
          <button onClick={handleReset} className="reset-button">Reset</button>
        </div>
      </div>
    </div>
  );
};

export default CommutatorGenerator;
