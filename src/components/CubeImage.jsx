import React from 'react';
import './CubeImage.css';
import CubeProfileImage from './CubeProfileImage';

const COLORS = {
  Y: '#e9cc2bff', // Yellow
  W: '#ebe6d2ff', // White
  B: '#2774e9ff', // Blue
  G: '#6fcf21ff', // Green
  R: '#af0d0dff', // Red
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

const TopDownView = ({ size, colorMap, arrows }) => {
  const maxSize = 250;
  const width = maxSize;
  const height = maxSize;
  const cornerPercent = getCornerPercent(size);
  const cornerSize = maxSize / (2 + 1 / cornerPercent);
  const sideStickerSize = cornerSize;
  const faceSize = maxSize - 2 * sideStickerSize;
  const centerSize = size > 2 ? (faceSize - 2 * cornerSize) / (size - 2) : 0;

  const stickerGap = 14 / size;

  const gridPositions = [0];
  for (let i = 0; i < size; i++) {
    let sizeToAdd;
    if (i === 0 || i === size - 1) {
      sizeToAdd = cornerSize;
    } else {
      sizeToAdd = centerSize;
    }
    gridPositions.push(gridPositions[i] + sizeToAdd);
  }

  const getGridCenter = (position) => {
    const r_first = 0;
    const r_mid = Math.floor((size - 1) / 2);
    const r_last = size - 1;

    const c_first = 0;
    const c_mid = Math.floor((size - 1) / 2);
    const c_last = size - 1;

    let r, c;

    switch (position) {
      case 1: r = r_first; c = c_first; break;
      case 2: r = r_first; c = c_mid;   break;
      case 3: r = r_first; c = c_last;  break;
      case 4: r = r_mid;   c = c_first; break;
      case 5: r = r_mid;   c = c_mid;   break;
      case 6: r = r_mid;   c = c_last;  break;
      case 7: r = r_last;  c = c_first; break;
      case 8: r = r_last;  c = c_mid;   break;
      case 9: r = r_last;  c = c_last;  break;
      default: r = 0; c = 0;
    }

    const x = sideStickerSize + gridPositions[c] + (gridPositions[c+1] - gridPositions[c]) / 2;
    const y = sideStickerSize + gridPositions[r] + (gridPositions[r+1] - gridPositions[r]) / 2;

    return { x, y };
  };

  const stickers = [];
  const map = (colorMap || []).join('').split('');

  const get3x3PatternColor = (r, c, s, colorMap) => {
    const isTop = r === 0;
    const isBottom = r === s - 1;
    const isLeft = c === 0;
    const isRight = c === s - 1;

    if (isTop && isLeft) return colorMap[0];
    if (isTop && isRight) return colorMap[2];
    if (isBottom && isLeft) return colorMap[6];
    if (isBottom && isRight) return colorMap[8];

    if (isTop) return colorMap[1];
    if (isBottom) return colorMap[7];
    if (isLeft) return colorMap[3];
    if (isRight) return colorMap[5];
    
    return colorMap[4];
  };

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = r * size + c;
      const color = get3x3PatternColor(r, c, size, map);
      
      const stickerW = gridPositions[c+1] - gridPositions[c] - stickerGap;
      const stickerH = gridPositions[r+1] - gridPositions[r] - stickerGap;
      const cornerRadius = Math.min(stickerW, stickerH) * 0.15;

      stickers.push(
        <rect
          key={`top-${i}`}
          x={sideStickerSize + gridPositions[c] + stickerGap / 2}
          y={sideStickerSize + gridPositions[r] + stickerGap / 2}
          width={stickerW}
          height={stickerH}
          fill={COLORS[color || 'X']}
          rx={cornerRadius}
          ry={cornerRadius}
        />
      );
    }
  }

  const getSidePatternColor = (i, s, colorSlice) => {
    if (s <= 2) return colorSlice[i];
    if (i === 0) return colorSlice[0];
    if (i === s - 1) return colorSlice[2];
    return colorSlice[1];
  };

  const backColors = map.slice(9, 12);
  const frontColors = map.slice(12, 15);
  const leftColors = map.slice(15, 18);
  const rightColors = map.slice(18, 21);

  for (let i = 0; i < size; i++) {
    const stickerW = gridPositions[i+1] - gridPositions[i] - stickerGap;
    const stickerH = gridPositions[i+1] - gridPositions[i] - stickerGap;

    // Back and Front stickers
    const backFront_cornerRadius = Math.min(stickerW, sideStickerSize - stickerGap) * 0.15;
    const backColor = getSidePatternColor(i, size, backColors);
    stickers.push(<rect key={`back-${i}`} x={sideStickerSize + gridPositions[i] + stickerGap/2} y={stickerGap/2} width={stickerW} height={sideStickerSize - stickerGap} fill={COLORS[backColor || 'X']} rx={backFront_cornerRadius} ry={backFront_cornerRadius}/>);
    const frontColor = getSidePatternColor(i, size, frontColors);
    stickers.push(<rect key={`front-${i}`} x={sideStickerSize + gridPositions[i] + stickerGap/2} y={sideStickerSize + faceSize + stickerGap/2} width={stickerW} height={sideStickerSize - stickerGap} fill={COLORS[frontColor || 'X']} rx={backFront_cornerRadius} ry={backFront_cornerRadius}/>);
    
    // Left and Right stickers
    const leftRight_cornerRadius = Math.min(sideStickerSize - stickerGap, stickerH) * 0.15;
    const leftColor = getSidePatternColor(i, size, leftColors);
    stickers.push(<rect key={`left-${i}`} x={stickerGap/2} y={sideStickerSize + gridPositions[i] + stickerGap/2} width={sideStickerSize - stickerGap} height={stickerH} fill={COLORS[leftColor || 'X']} rx={leftRight_cornerRadius} ry={leftRight_cornerRadius}/>);
    const rightColor = getSidePatternColor(i, size, rightColors);
    stickers.push(<rect key={`right-${i}`} x={sideStickerSize + faceSize + stickerGap/2} y={sideStickerSize + gridPositions[i] + stickerGap/2} width={sideStickerSize - stickerGap} height={stickerH} fill={COLORS[rightColor || 'X']} rx={leftRight_cornerRadius} ry={leftRight_cornerRadius}/>);
  }

  const arrowElements = (arrows || []).map((arrowCode, index) => {
    const startPos = parseInt(arrowCode[0]);
    const endPos = parseInt(arrowCode[1]);
    const headType = parseInt(arrowCode[2]);

    const { x: x1, y: y1 } = getGridCenter(startPos);
    const { x: x2, y: y2 } = getGridCenter(endPos);

    const markerStart = headType === 0 || headType === 1 ? 'url(#arrowhead-start)' : '';
    const markerEnd = headType === 0 || headType === 2 ? 'url(#arrowhead-end)' : '';

    const shortenType = arrowCode.length > 3 ? parseInt(arrowCode[3]) : 0;

    // --- Create "weaving" illusion by shortening the line to create a gap --- 
    const gap = 18;
    let finalX1 = x1, finalY1 = y1, finalX2 = x2, finalY2 = y2;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx*dx + dy*dy);

    if (length > 0) { // Avoid division by zero
      const unitDx = dx / length;
      const unitDy = dy / length;

      // Shorten end of the line
      if ((shortenType === 2 || shortenType === 3) && length > gap) {
        finalX2 = x2 - unitDx * gap;
        finalY2 = y2 - unitDy * gap;
      }

      // Shorten start of the line
      if ((shortenType === 1 || shortenType === 3) && length > gap) {
        finalX1 = x1 + unitDx * gap;
        finalY1 = y1 + unitDy * gap;
      }
    }
    // --------------------------------------------------------------------------

    return (
      <line
        key={`arrow-${index}`}
        x1={finalX1} y1={finalY1} x2={finalX2} y2={finalY2}
        stroke="#000"
        strokeWidth="4"
        strokeLinecap="round"
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
    );
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="cube-image">
      <defs>
        <marker id="arrowhead-end" viewBox="0 -5 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,-4L8,0L0,4" fill="#000" />
        </marker>
        <marker id="arrowhead-start" viewBox="0 -5 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,-4L8,0L0,4" fill="#000" />
        </marker>
      </defs>
      {stickers}
      <g>{arrowElements}</g>
    </svg>
  );
};

const CubeImage = ({ viewType, size, colorMap, arrows, stretchModes, activeParityEdge }) => {
  if (viewType === 'top-down') {
    return <TopDownView size={size} colorMap={colorMap} arrows={arrows} />;
  }
  if (viewType === 'profile') {
    return <CubeProfileImage size={size} colorMap={colorMap} stretchModes={stretchModes} activeParityEdge={activeParityEdge} />;
  }

  return (
    <div className="cube-image-placeholder">
      <p>View: {viewType}</p>
      <p>Size: {size}x{size}</p>
    </div>
  );
};

export default CubeImage;
