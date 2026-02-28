export const translateAlgorithm = (algorithm, cubeSize, baseSize = 4, category = '') => {
  if (!algorithm) return '';

  return algorithm.split(' ').map(move => {
    let currentMove = move;

    // M-move transformation for PLLs on 6x6+
    if (category === 'pll' && cubeSize >= 6) {
      const originalMove = currentMove;
      // Use a regex to find all occurrences of M, M', or M2 within the chunk.
      // The order in the regex (M2|M'|M) is important to prevent 'M' from matching in 'M2'.
      currentMove = currentMove.replace(/M2|M'|M/g, (match) => {
        if (match === 'M2') return '[Rw2 R2]';
        if (match === "M'") return "[Rw R']";
        if (match === 'M') return "[Rw' R]";
        return match; // Should not be reached
      });

      // If a replacement happened, we assume this chunk is fully processed and return it.
      if (originalMove !== currentMove) {
        return currentMove;
      }
    }

    // If no M-move was transformed, proceed to wide move translation.
    const sizeDifference = cubeSize - baseSize;
    if (sizeDifference !== 0 && currentMove.includes('w')) {
      const originalMove = currentMove;
      // Strip parentheses to find the core move, e.g., 'Rw' from '(Rw)'
      const coreMove = originalMove.replace(/[()]/g, '');

      // If after stripping parens it's not a wide move, do nothing.
      if (!coreMove.includes('w')) return originalMove;

      const baseMove = coreMove.charAt(0).toUpperCase();
      const depth = cubeSize > 4 ? Math.floor(cubeSize / 2) : 2;
      const newDepth = depth > 2 ? `${depth}` : '';
      
      let replacement = '';
      if (coreMove.includes('w\'')) {
        replacement = `${newDepth}${baseMove}'`;
      } else if (coreMove.includes('w2')) {
        replacement = `${newDepth}${baseMove}2`;
      } else {
        replacement = `${newDepth}${baseMove}`;
      }
      // Re-apply the transformation to the original string to preserve parentheses.
      return originalMove.replace(coreMove, replacement);
    }

    return currentMove;
  }).join(' ');
};
