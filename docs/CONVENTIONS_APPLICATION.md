# Coding-conventions application — homeEditor

The rules in [`CODING_CONVENTIONS.md`](CODING_CONVENTIONS.md) have been applied to `index.html` and the JavaScript sources in `res/`.

## Changes

- Reformatted executable JavaScript blocks with **Allman braces** and **four-space indentation**. Kept simple one-line functions where readable and short scalar arrays compact.
- Replaced the former `editor` and `qSVG` singleton object literals with **named browser constructors**, `Editor` and `QSVG`, with public methods directly on `this`. The global `editor` and `qSVG` instances continue to exist, so existing callers do not need changes.
- Replaced executable `onclick` and `onfocus` HTML attributes with declarative `data-editor-action` / `data-editor-focus` attributes. `res/ui_actions.js` contains named, browser-first handlers; direct event listeners retain the original action order relative to delegated Bootstrap handlers.
- Normalized `index.html` indentation to four spaces. Script loading remains sequential using ordinary `<script src="...">` tags; no bundler or module loader is needed.
- Replaced jQuery and the jQuery Mousewheel plugin with standard DOM methods, including native SVG elements, `addEventListener`, `classList`, and `wheel` events. Small DOM helpers live in `res/dom.js`. See [`DOM_MIGRATION.md`](DOM_MIGRATION.md).
- Kept existing data and functionality in place; Bootstrap 5 and stylesheet/icon CDN resources remain separate from the removed jQuery dependency. No new production dependencies or JSON requests have been introduced.

## Verification

- All six `res/*.js` files pass `node --check` (a development-time check only, not a runtime dependency).
- `test/index.html` is a dependency-free browser smoke test covering the constructors, SVG nodes, visibility helpers, and UI bindings, openable directly from disk.
- An isolated Chromium document was used to load the application scripts without any jQuery global. Manual browser automation exercised square-plan loading, wall/room creation, SVG object creation, mode changes, report visibility, wheel zoom, and submenu toggling.

## Compatibility scope

The DOM migration removes jQuery, not Bootstrap 5 or the externally linked fonts and stylesheets. Full end-to-end visual regression across browsers has not been performed; navigation to local and loopback URLs is restricted in this environment. The application scripts continue to support the `file://` workflow. Main-page CDN resources may still require an internet connection.
