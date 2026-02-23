import React from 'react';

const COLORS = {
  Y: '#e9cc2bff', // Yellow
  W: '#ebe6d2ff', // White
  B: '#2774e9ff', // Blue
  G: '#6fcf21ff', // Green
  R: '#af0d0dff', // Red
  O: '#e25c13ff', // Orange
  X: '#454545', // Gray for non-visible/other faces
  S: '#2F2F2F', // Gray for non-visible/other faces
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

const CubeProfileImage = ({ size, colorMap, stretchModes, activeParityEdge }) => {
  const svgWidth = 400;
  const svgHeight = 350;

  // Isometric projection angles
  const angle = Math.PI / 6; // 30 degrees
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // 1. Define Unprojected Grid
  const baseSize = 200; // An arbitrary size for our unprojected 2D grid
  const cornerPercent = getCornerPercent(size);
  const cornerSize = baseSize * cornerPercent;
  const centerSize = size > 2 ? (baseSize - 2 * cornerSize) / (size - 2) : 0;
  
  const gridPositions = [0];
  for (let i = 0; i < size; i++) {
    let sizeToAdd = (i === 0 || i === size - 1) ? cornerSize : centerSize;
    gridPositions.push(gridPositions[i] + sizeToAdd);
  }
  const faceSize = gridPositions[size];
  const strokeWidth = 12 / size;

  // 2. Calculate Scaling Factor to fit the projected cube in the SVG
  const projectedWidth = 2 * faceSize * cosA;
  const projectedHeight = faceSize * (2 * sinA) + faceSize;
  const scale = Math.min((svgWidth * 0.9) / projectedWidth, (svgHeight * 0.9) / projectedHeight);

  // 3. Apply Scaling
  const scaledGrid = gridPositions.map(p => p * scale);
  const scaledFaceSize = faceSize * scale;

  // 4. Calculate Centering Offsets
  const finalWidth = 2 * scaledFaceSize * cosA;
  const finalHeight = scaledFaceSize * (2 * sinA) + scaledFaceSize;
  const xOffset = (svgWidth - finalWidth) / 2;
  const yOffset = (svgHeight - finalHeight) / 2;

  // 5. Transformation functions
  const transformPoint = (p, face) => {
    let isoX, isoY;
    if (face === 'top') {
      const originX = xOffset + scaledFaceSize * cosA;
      const originY = yOffset;
      isoX = originX + (p.x - p.y) * cosA;
      isoY = originY + (p.x + p.y) * sinA;
    } else if (face === 'front') {
      const originX = xOffset;
      const originY = yOffset + scaledFaceSize * sinA;
      isoX = originX + p.x * cosA;
      isoY = originY + p.x * sinA + p.y;
    } else { // right
      const originX = xOffset + 2 * scaledFaceSize * cosA;
      const originY = yOffset + scaledFaceSize * sinA;
      isoX = originX - p.x * cosA;
      isoY = originY + p.x * sinA + p.y;
    }
    return `${isoX},${isoY}`;
  };

  const stickers = [];

          const getDynamicSourceIndex = (targetIndex, targetSize, activeParityEdge) => {
            const numFlippedEdges = (activeParityEdge - 1) * 2 + (targetSize % 2 === 0 ? 2 : 1);
            const startOfCenter = Math.floor((targetSize - numFlippedEdges) / 2);
            const endOfCenter = startOfCenter + numFlippedEdges - 1;
        
            if (targetIndex < startOfCenter) return 0; // Left
            if (targetIndex > endOfCenter) return 2; // Right
            return 1; // Center
          };

  const getSourceIndex = (targetIndex, targetSize, mode) => {
    if (mode === 'link-corners') {
      const center1 = Math.floor((targetSize - 1) / 2);
      const center2 = Math.ceil((targetSize - 1) / 2);
      if (targetIndex === center1 || targetIndex === center2) return 1;
      return targetIndex < center1 ? 0 : 2;
    }
    if (targetIndex === 0) return 0;
    if (targetIndex === targetSize - 1) return 2;
    return 1;
  };

  const getStretchedColor = (faceMap, r_target, c_target, s_target, faceName, stretchModes = {}) => {
    let rowStretchMode = 'link-centers';
    let colStretchMode = 'link-centers';
    if (faceName === 'top') {
      if (r_target === s_target - 1) rowStretchMode = stretchModes['Top-Front'] || 'link-centers';
      if (c_target === s_target - 1) colStretchMode = stretchModes['Top-Right'] || 'link-centers';
    } else if (faceName === 'front') {
      if (r_target === 0) rowStretchMode = stretchModes['Top-Front'] || 'link-centers';
      if (c_target === s_target - 1) colStretchMode = stretchModes['Front-Right'] || 'link-centers';
    } else if (faceName === 'right') {
      if (r_target === 0) rowStretchMode = stretchModes['Top-Right'] || 'link-centers';
            if (c_target === 0) colStretchMode = stretchModes['Front-Right'] || 'link-centers';
        }
        const r_source = getSourceIndex(r_target, s_target, colStretchMode);
        let c_source;
        if (rowStretchMode === 'dynamic') {
            c_source = getDynamicSourceIndex(c_target, s_target, activeParityEdge);
        } else {
            c_source = getSourceIndex(c_target, s_target, rowStretchMode);
        }
        const sourceRow = faceMap[r_source];
        return (sourceRow && sourceRow[c_source]) ? sourceRow[c_source] : 'X';
      };

  const createFace = (faceName, faceData) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const color = (stretchModes && Object.keys(stretchModes).length > 0) 
          ? getStretchedColor(faceData, r, c, size, faceName, stretchModes)
          : faceData[r][c];
        
        const stickerX = scaledGrid[c];
        const stickerY = scaledGrid[r];
        const stickerW = (scaledGrid[c + 1] - scaledGrid[c]);
        const stickerH = (scaledGrid[r + 1] - scaledGrid[r]);

        const p1 = { x: stickerX, y: stickerY };
        const p2 = { x: stickerX + stickerW, y: stickerY };
        const p3 = { x: stickerX + stickerW, y: stickerY + stickerH };
        const p4 = { x: stickerX, y: stickerY + stickerH };

        const points = `${transformPoint(p1, faceName)} ${transformPoint(p2, faceName)} ${transformPoint(p3, faceName)} ${transformPoint(p4, faceName)}`;

        stickers.push(
          <polygon
            key={`${faceName}-${r}-${c}`}
            points={points}
            fill={COLORS[color || 'X']}
            stroke={COLORS['S']}
            strokeWidth={strokeWidth}
          />
        );
      }
    }
  };

  if (colorMap && colorMap.top) createFace('top', colorMap.top);
  if (colorMap && colorMap.front) createFace('front', colorMap.front);
  if (colorMap && colorMap.right) createFace('right', colorMap.right);

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="cube-image">
      <g>{stickers}</g>
    </svg>
  );
};

export default CubeProfileImage;
