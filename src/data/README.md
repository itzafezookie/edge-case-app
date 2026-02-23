# EdgeCase Algorithm Data Schema

This document explains how to configure algorithm data in the `.json` files in this directory.

## Algorithm Entry Structure

Each algorithm is an object within the main JSON array. It has the following structure:

```json
{
  "caseName": "Ua-Perm (Edges)",
  "algorithm": "(R U' R' U') (R U R') F'",
  "imageIdentifier": "pll-uaperm",
  "visualization": { ... }
}
```

- `caseName`: The display name of the algorithm.
- `algorithm`: The move sequence for the algorithm.
- `imageIdentifier`: A unique ID, currently not used but reserved for the future.

---

## Visualization Object

The `visualization` object controls how the cube state is displayed.

```json
"visualization": {
  "viewType": "top-down",
  "size": 3,
  "colorMap": [ ... ],
  "arrows": [ ... ]
}
```

- `viewType`: Can be `top-down` (for OLL/PLL) or `profile` (for Parity).
- `size`: The base size of the pattern (usually `3` for OLL/PLL).
        - `stretchModes` (Optional, Profile View Only): An object that defines how 3-character patterns are stretched along specific edges. If an edge is not specified, it defaults to `link-centers`.
          - Keys can be `Top-Front`, `Top-Right`, or `Front-Right`.
          - Values can be `link-centers` or `link-corners`.
        - `colorMap`: An array of strings that defines the colors of the stickers. See the "Color Map" section below for details.
- `arrows`: An array of strings that defines the movement arrows. See the "Arrows" section for details.

---

### Color Map

The `colorMap` is an array of 7 strings representing rows of stickers, laid out in the following order:

1.  Top Face - Top Row
2.  Top Face - Middle Row
3.  Top Face - Bottom Row
4.  Back Face (top edge)
5.  Front Face (bottom edge)
6.  Left Face (left edge)
7.  Right Face (right edge)

The app uses "stretching" logic, so for a 3x3 pattern on a larger cube:
- The first and last items in a row are treated as corners.
- All items in between are "stretched" to fill the middle section.

Example for a single row: `"YXY"` on a 7x7 cube would result in `Y-XXXXX-Y`.

---

### Arrows

Arrows are defined by a 4-digit string code: `[START][END][HEAD][GAP]`

-   **`[START]` (1st digit):** The starting region of the arrow, based on a 3x3 grid:
    -   `1 2 3`
    -   `4 5 6`
    -   `7 8 9`

-   **`[END]` (2nd digit):** The ending region of the arrow (using the same 1-9 grid).

-   **`[HEAD]` (3rd digit):** Defines where arrowheads appear.
    -   `0`: Arrowheads on both ends.
    -   `1`: Arrowhead at the **start** point.
    -   `2`: Arrowhead at the **end** point.

-   **`[GAP]` (4th digit, Optional):** Creates a visual gap by shortening the line, useful for "weaving" effects in cycles.
    -   `0` or omitted: No gap.
    -   `1`: Gap at the **start** of the line.
    -   `2`: Gap at the **end** of the line.
    -   `3`: Gap at **both** ends.

#### Example:

`"1322"` would create an arrow from region `1` to region `3`.
- It will have an arrowhead at the end (`...2.`).
- The line will be shortened at the end (`...2`), creating a gap before the arrowhead at region `3`.