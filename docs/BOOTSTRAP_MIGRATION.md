# Replacing Bootstrap with native DOM and local CSS

This update removes the two Bootstrap **5.2.2** CDN includes from `index.html`:

- `bootstrap.min.css` — replaced with the styles needed by this project at the start of `res/style.css`.
- `bootstrap.min.js` — replaced with a small native `EditorModalController` in `res/dom.js`.

The CSS subset is based on the public Bootstrap 5 interface and covered by the Bootstrap project's MIT license. The UI no longer needs Bootstrap, jQuery, a CSS framework, a build step, or a network connection to run.

## CSS implemented locally

| Area | Used selectors |
| --- | --- |
| Basic normalization | box-sizing, body, headings, paragraphs, lists, forms, buttons, images |
| Buttons | `.btn`, `.btn-primary`, `.btn-success`, `.btn-danger`, `.btn-warning`, `.btn-info`, `.btn-light`, `.disabled`, `.shadow` |
| Toolbar compatibility | `.btn-default` (legacy style), `.pull-right` (legacy float), `.list-unstyled` |
| Form controls | `.form-control`, `.form-select`, `.input-group`, `.input-group-addon` (legacy label) |
| Responsive grid | `.row`, `.col-md-2`, `.col-md-4`, `.col-md-6`, `.col-md-8` |
| Utilities | `.img-fluid`, `.d-flex`, `.w-100`, `.flex-column`, `.flex-md-row`, `.justify-content-center`, `.gap-4`, `.mt-2`, `.m-2` |
| Dialogs | `.modal`, `.fade`, `.show`, `.modal-open`, `.modal-backdrop`, `.modal-dialog`, `.modal-dialog-centered`, `.modal-lg`, `.modal-content`, `.modal-header`, `.modal-title`, `.modal-body`, `.modal-footer`, `.btn-close` |

The subset is **not** the entire Bootstrap framework. When new UI classes are introduced, add only their necessary styles to `res/style.css`.

Original project styles, including the local Font Awesome declarations, are kept after the framework-compatible subset, so project-specific overrides retain precedence.

## Native modal interface

`res/dom.js` offers:

```javascript
showEditorModal('myModal');
showEditorModal('textToLayer');
hideEditorModal('textToLayer');
```

Dialog dismiss buttons use `data-editor-dismiss="modal"`, instead of Bootstrap's `data-bs-dismiss="modal"`. Dialogs close through their buttons, an Escape key press, or a click outside the dialog. The controller restores focus, maintains a backdrop and document scroll lock, and dispatches `editor-modal-shown` / `editor-modal-hidden` events. The editor's text creation callback now listens for `editor-modal-hidden`.

Existing editor actions keep their `data-editor-action` attributes; their handlers run before the delegated dismissal handler.

## Offline assets

The project includes PNG images for new-plan options and materials, but `index.html` previously referred to JPG paths. Those nine paths were updated to match the existing PNG assets, without changing the images.

Font Awesome continues to use the existing local files under `res/webfonts` via `res/style.css`. No font files were changed.

## Verification

Open `test/index.html` locally to run the offline regression checks, including the native modal dismissal and event checks. To manually verify the full editor, open `index.html` and test the welcome dialog, new-plan buttons, toolbar modes, room/report grid, text dialog, zoom, and responsive layout.
