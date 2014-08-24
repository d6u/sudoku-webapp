# Sudoku Webapp

Demo: http://sudoku.daiwei.lu

## Serve Locally

1. Clone and cd into project dir.
- Run `npm install` (assume you have Node.js 0.10).
- Run `bower install` to install client side dependencies. If you don't have bower, please install it with `npm install bower -g`.
- Run `gulp serve`, gulp will fire local server and open webapp in default browser. If not you can manually open `localhost:9000` in the browser you like.
- Now you can play!!

## Project Structure

- app: where client side source is stored.
- test: where client side specs are stored.
- gulpfile.js: gulp task config

## Technology Used

- Node.js as development dependency to build the webapp.
- SVG to build UI
- Jade as template engine.
- SCSS as CSS preprocessor.
- Mocha and chai for testing framework.
- jQuery, lo-dash, hammer.js, normalize.css as client side dependencies.

## Reason of Technology Choices

- SVG is flexible, scaleable and has a relatively nice cross browser support (IE9+)
- jQuery is widely adopted and easy to use for DOM manipulations.
- lo-dash has varieties of helper methods to process arraies or collections.
- hammer.js provides touch gestures on touch enabled devices. In this app I used `tap` gesture on mobile device.
- normalize.css resets style differences between browsers, provides a uniformed look.
- Jade and SCSS got chosen because it makes generating HTML and CSS nice and easy.

## Trade Offs (Potential Improvements)

- I have to give up using a specific SVG manipulation library such as SVG.js, because I started with jQuery and switching will waste codes I already wrote.
- If I had a chance to use SVG.js, I could add more animations to the UI to make it flow better.
- Pop up number pad sometimes covers part of the board. Could be made to avoid certain areas of the board to provide better user experiences.

## Run Test

1. cd into test dir
- Run `bower install`
- Open `index.html` in the browser you want to run tests in.
