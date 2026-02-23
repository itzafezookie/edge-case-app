export const translateAlgorithm = (algorithm, currentSize, baseSize) => {
  // If the current size is the same as the base size, no translation is needed.
  if (currentSize <= baseSize) {
    return algorithm;
  }

  // This regex finds lowercase slice moves (r, l, u, d, f, b) that are not
  // part of a wider move (like Rw) and are not already numbered (like 3r).
  // It looks for a word boundary, the move letter, and ensures it's not followed by 'w'.
  const sliceMoveRegex = /\b([rludfb])(?!w)(['2]*)/g;

  return algorithm.replace(sliceMoveRegex, (match, move, modifier) => {
    // For now, we are only handling the 4x4 to NxN case for 'r' and 'l'.
    // This can be expanded later.
    if (baseSize === 4 && (move === 'r' || move === 'l')) {
      const numInnerSlices = (currentSize / 2) - 1;
      if (numInnerSlices > 1) {
        const endSlice = currentSize / 2;
        return `[2-${endSlice}]${move}${modifier}`;
      }
    }
    
    // If no specific translation rule applies, return the original move.
    return match;
  });
};
