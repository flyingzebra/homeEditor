# HomeEditor Script terminal

The **SCRIPT** button is the first item in HomeEditor's main toolbar. It switches the left navigation pane to a full-height CLI terminal, with a **◀ TOOLS** button to return to the normal menu. The terminal is powered by the existing `res/COM_TERM.js` and `res/COM_TERM.css`. No network, Node.js or additional libraries are needed. It works directly from `file://`.

The terminal executes a **restricted set of commands** using HomeEditor's live `WALLS`, `OBJDATA` and `ROOM` containers, `editor` constructors, SVG rendering (`editor.architect`) and the existing `save()` history. It intentionally does **not** use `eval()` or allow arbitrary JavaScript. Index arguments are **zero-based**. Canvas positions are SVG-coordinate units; wall widths/heights use centimetres. The current `meter` SVG scale is available through `status`.

## Examples

```text
help
help editor
help editor.wall
help qsvg.create
help script.addWall
status
walls
wall add 100 100 300 100 20 250
wall set 0 thick 25
wall set 0 height 280
wall move 0 20 0
wall delete 0
objects
object add gtl 250 300
object add plug 320 350 90
object move 0 350 355
object set 0 angle 90
object delete 0
rooms
undo
redo
clear
```

`help wall` and `help object` list each editing operation, with examples. `help editor` and `help qsvg` **discover help descriptors stored on the actual functions inside the `Editor` and `QSVG` constructors**; `help editor.architect`, `help qsvg.polygonize` and similar topics are available without duplicating those descriptions in the console source.

Wall construction accepts at least 0.3 m length; geometry is recalculated after edits. Wall moves update only the selected segment, which may disconnect it from neighboring walls. The command console can create energy symbols and stairs; doors/windows require interactive placement on existing wall segments and are not yet exposed through the command interface. The terminal only previews the already existing 2D project; height is metadata and does not create a 3D elevation.

Command history uses the terminal's own `HomeEditorScriptHistory` localStorage key. Each successful edit calls HomeEditor's `save()` for undo/redo. Invalid numeric values and unknown commands are rejected. Wall edits are rolled back if recomputing room geometry fails.

Open `test/home-script.html` for an offline regression test of the command parser, wall edits, and method help metadata.
