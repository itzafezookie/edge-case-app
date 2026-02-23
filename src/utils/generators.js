export const generateFinalEdgeParityMap = () => {
  // This returns a 3x3 source map. The stretching logic will use this
  // to color the full-size cube based on the dynamic stretch mode.
  return {
    top:   ["WWW", "WWW", "GWG"],
    front: ["WGW", "GGG", "GGG"],
    right: ["OOR", "RRR", "RRR"],
  };
};

export const generateFinalEdgeParityAlgo = (cubeSize, activeParityEdge) => {
  if (cubeSize < 5) return "N/A";

  const numFlippedEdges = (activeParityEdge - 1) * 2 + (cubeSize % 2 === 0 ? 2 : 1);
  const outerSliceCount = Math.floor((cubeSize - numFlippedEdges) / 2);
  const specialSliceCount = outerSliceCount + numFlippedEdges;

  const rw = `[1-${outerSliceCount}]Rw`;
  const lw = `[1-${outerSliceCount}]Lw`;
  const special_rw = `[1-${specialSliceCount}]Rw`;

  // Using '*' to denote line breaks for the UI
  return `${rw} U2 x * (${rw} U2 ${rw} U2) * (${special_rw}' U2 ${lw} U2) * (${rw}' U2 ${rw} U2) * ${rw}' U2 ${rw}'`;
};