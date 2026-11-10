# Wall height editing

Base: `88b3550ad7a7ce59050bd657fe354c46fa07d15b`.

- Every wall has a numeric `height` property expressed in **centimetres**.
- New walls and pre-existing saved plans without heights default to **250 cm**.
- In **Modify wall**, editing **Height** changes only the selected wall when the checkbox is clear.
- Checking **Apply this height to all walls in the current project** updates all current walls immediately. Subsequent height edits apply to all while it remains checked. Unchecking does not undo changes already made.
- The checkbox is a temporary editing scope and resets when a different wall is opened; individual height values persist in history, localStorage, and undo/redo.
- When every existing wall has the same height, newly drawn walls inherit that height. If heights differ, new walls default to 250 cm.
- Rebuilt wall segments inherit their original wall's height when splitting or extending wall geometry.
- Allowed values: 1 to 10000 cm (including fractions). Invalid values do not change the wall data.
- Height is **metadata only**; the 2D floor plan, wall thickness and room area calculations are intentionally unchanged.

Run `test/wall-height.html` directly in a browser to check the height model without dependencies. After applying, also manually verify Modify wall, the apply-to-all checkbox, and recovering history from the welcome dialog.
