# HomeEditor Script: object-container help

The SCRIPT terminal follows the object naming convention: constructor `Editor()` has its
primary instance `oEditor`, `QSVG()` has `oQSVG`, and `HomeEditorScript()` has
`oHomeEditorScript`.

## Read help directly from the live object instances

```text
print(oEditor.help)
print(oEditor.wall.help)
print(oEditor.wall.help.summary)
print(oQSVG.help)
print(oQSVG.measure.help)
print(oHomeEditorScript.addWall.help)
```

The `Editor` and `QSVG` constructors attach `.help` descriptors to their callable methods.
Their instance-level `.help` properties compile live, read-only catalogues of those
method descriptors. The CLI does not maintain a separate, potentially outdated list.
The descriptors contain method signatures, parameter descriptions and examples.
For instance, `oEditor.wall.help` documents the `new oEditor.wall(...)` constructor,
and explains the difference between constructing a wall object and adding it to
the working-area canvas.

`print(...)` is **read-only**. It resolves documented properties of the three named
object instances, but does not evaluate arbitrary JavaScript or execute methods.
It rejects function calls, global-object access and unsafe prototype paths.

## Editing the canvas

Use the existing, validated editing commands for actual canvas changes:

```text
wall add 100 100 300 100 20 250
wall set 0 height 280
object add plug 200 300
walls
objects
```

These operations update the actual canvas and use HomeEditor's history.
Constructing `new oEditor.wall(...)` by itself is **not** a drawing operation:
a caller using the JavaScript API must also append the wall to `WALLS`, redraw,
and save. The restricted Script terminal does not execute arbitrary JavaScript
expressions; see the separate `wall add` command in the CLI.

The original `help editor`, `help editor.wall`, `help qsvg.create`, etc. remain
available as compatibility aliases, while `help oEditor.wall` and
`help oQSVG.create` are the preferred object-based forms.

Open `test/cli-object-help.html` in a browser to test the help interface without
Node.js, a server, or dependencies.
