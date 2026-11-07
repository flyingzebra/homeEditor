# homeEditor — Native DOM migration

## Scope

All required jQuery runtime dependencies have been removed from the editor sources. The production entry point (`index.html`) no longer loads the jQuery CDN or `res/mousewheel.js`; the latter has been deleted. The editor still uses classic scripts in order and requires no build step.

The remaining external resources (Bootstrap 5, Font Awesome, stylesheet/font CDN assets) are **not jQuery dependencies**, but may still require a network connection. This migration does not claim the entire page is CDN-free.

## API substitutions

| Former dependency | Native browser solution |
|---|---|
| `$('#id')` | `document.getElementById('id')` |
| `$('.class')` | `document.querySelectorAll('.class')` with `forEach` |
| `.click(fn)`, `.on(...)` | `element.addEventListener(eventName, fn)` |
| `.addClass(...)`, `.removeClass(...)` | `element.classList.add(...)`, `.remove(...)` |
| `.html(...)`, `.val(...)`, `.empty()` | `innerHTML`, `value`, `replaceChildren()` |
| `.append(svgNode)` | `element.append(svgNode)` |
| `.attr({...})` on SVG | `setSVGAttributes(element, attrs)` using `setAttribute` |
| `.hide()`, `.show()`, `.toggle()` | Small visibility functions in `res/dom.js` using `style.display` and `getComputedStyle` |
| `.width()`, `.height()`, `.offset()` | `clientWidth`, `clientHeight`, `getBoundingClientRect()` and scroll offsets |
| jQuery Mousewheel | `wheel` with `{ passive: false }`, synchronous `preventDefault` and throttled zoom |
| `$(selector).modal('hide')` | `bootstrap.Modal.getOrCreateInstance(element).hide()` |

The main architectural difference is that `qSVG.create()` returns a real `SVGElement` instead of a jQuery wrapper. All `.graph` operations use standard DOM nodes, `append`, `remove`, `querySelectorAll`, and `getBoundingClientRect`.

### Wheel direction

Native `WheelEvent.deltaY` has the opposite sign from the normalized jQuery Mousewheel `deltaY`: a negative native delta means wheel-up (zoom in); a positive one means wheel-down (zoom out). The listener cancels page scrolling *immediately* before passing the delta to the throttled zoom handler.

### Visibility and optional controls

The previous jQuery implementation silently ignored selectors without a matching element. Native `getElementById` returns `null`; optional controls absent from `index.html` (currently `rect_mode` and `grid_mode`) use null-safe listeners. Class-state reset ignores missing optional buttons. The menu toggle now hides other menus while retaining its own open/closed state.

## Verification

Open `test/index.html` in a browser: all tests run without Node.js, bundlers, jQuery or external CSS/JS. The browser smoke test validates constructors, native SVG creation and attributes, visibility and UI action bindings. Main-editor tests additionally verified the `newSquare` initial plan (4 walls, 1 room), object creation/update, toolbar actions, reports, menu toggles and wheel zoom in an isolated Chromium document. Full visual regression and genuine `file://` page navigation were not available in this environment.

## Supported browsers

This migration targets modern browsers supporting `querySelectorAll`, `Node.append`, `Element.remove`, `Element.replaceChildren`, `classList`, `getComputedStyle`, `SVGElement` and `WheelEvent`. It intentionally does not retain the very old Firefox 39-era support claim in the original README.
