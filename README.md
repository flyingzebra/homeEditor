# homeRoughEditor v0.1

Help me to make this project an essential and free resource for all, so that any developer / integrator can propose to create **_plans for house_, _apartment_**, etc. online. **Full JavaScript**, using native browser DOM and SVG APIs without jQuery. A locally maintained CSS subset replaces Bootstrap, and Font Awesome icons are loaded from local webfonts. For cons, forgive me for my English, it is very rusty !!!

## Getting Started

[CLICK HERE](https://flyingzebra.github.io/homeEditor/)

### Installing

Just have to copy the files into a directory and open the index.html file in your browser. This native-DOM version targets modern browsers. The editor scripts, interface styles, and Font Awesome resources are local; no external Bootstrap or jQuery downloads are required.

## Running the tests

Personally I only test all this with the mozilla debug console

## TODO
- Make TouchScreen functions for tablet (or smartphone, but too tiny screen i think...)
- Make interoperability for browsers (actually good for Moz.)
- Refine the CSS and buttons behavior
- Refine the Historical system (use LocalStorage)
- Complete the translation (i'm French) 
- Make your own system/functions to export plan to any database 

## Built With

* [Atom.io](https://atom.io/) - My code editor. Simple and free.
* Native browser DOM/SVG APIs and a project-specific CSS subset based on the Bootstrap 5 interface (MIT license).

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://en.wikipedia.org/wiki/MIT_License) on Web file for details




## Coding conventions and offline checks

The JavaScript conventions are documented in [`docs/CODING_CONVENTIONS.md`](docs/CODING_CONVENTIONS.md), with implementation notes in [`docs/CONVENTIONS_APPLICATION.md`](docs/CONVENTIONS_APPLICATION.md) and the [native DOM migration guide](docs/DOM_MIGRATION.md). Open [`test/index.html`](test/index.html) directly in a browser for dependency-free constructor, SVG/DOM, UI, and modal smoke tests. See [`docs/BOOTSTRAP_MIGRATION.md`](docs/BOOTSTRAP_MIGRATION.md) for the local CSS scope and migration details.
