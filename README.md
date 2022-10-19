## Equal Experts groceries assignment
### Version number `5b8d0fd276b6d288905ed2f63a934e057e8feca2`

https://equalexperts.github.io/ee-tech-interviews-uk/grocery-list-problem.html

## Prerequisites

This project needs node version 16 to run and cypress to execute tests.

The preferred method of installing node differs between platforms, I'd suggest using [nvm](https://github.com/nvm-sh/nvm) on mac/linux or an [installer](https://nodejs.org/en/download/) on windows.

Once node is installed, run `npm i -g cypress` to install cypress.

## Setup

Open two terminals
* In terminal 1, go to the `groceries-fe` folder and run `npm i`
  * run `npm start`
* In terminal 2, go to the `groceries-api` folder and run `npm i`
  * run `npm run start:dev`

This should start the server on port 5000 and the React app on port 3000, as well as open it in a browser.

The app is a simple CRUD grocery list.

The 'U' in CRUD means that items can be ticked and reordered.

State is kept in memory, on the server.

State can be reset without restarting the server, by clicking the 'Reset Data' button, below the list.

## Testing

### UI

In the `groceries-fe` folder, run either `npm run test:unit` to run a basic unit test or `npm run test:component` to run more thorough cypress tests.

You can also run `npm run test:component:headed:stayopen` to see cypress tests executing in your browser.

### API

In the `groceries-api` folder, run `npm run test:cov` to run the tests and see the coverage.

## Justifications:

* I used npx create-react-app to have a solid base that has an integrated test runner
* I used NestJS for similar reasons on the API side.
* I included both the front end and back end code in a single repo for simplicity but I did not waste time setting the project up as a monorepo with nx or lerna, I think the steps to run the repo by hand aren't too complicated.
* No TypeScript - I think there's a place for TypeScript in bigger projects but the effort of adding it didn't seem justified.
  * Apart from NestJS where it comes included.
* I used Adobe Spectrum as the component library. I was hesitant at first and wanted to use Grommet because the draggable API for lists is Spectrum is in RC stage but it has proven to be more stable than Grommet and I prefer the style of Adobe Spectrum. Support for keyboard navigation is also better.
* Branding is done through using an Equal Experts favicon and applying the accent colour<sup>*</sup> found on https://www.equalexperts.com/brand/.
  * <sup>*</sup> - or at least as close as I could get with [Adobe Spectrum colors](https://react-spectrum.adobe.com/react-spectrum/styling.html#color-values), unfortunately, theming support isn't quite there yet to bring your own values.

## Final thoughts

* Branding isn't as prominent as I'd like it to be, I found that theming is a limitation of the component library I'm using a bit late in the development process.
* I wanted to use Supabase for the database but decided that the app got complex enough as it is and I kept the data in memory.
* I had to use e2e test (cypress) to test the front-end, rather than unit tests because react testing library does not play well with components that need to be dragged to be repositioned.
  * I wasn't going to use cypress initially as I though it would be a bit overkill for this app but good test coverage was one of the key requirements and that was the best approach I could think that I could get to work in reasonable time.
  * I couldn't get test coverage to work in cypress, none of the examples used with create-react-app did the trick with this config but I think it's really decent and covers most user stories that I could think of.
* On the backend, the test coverage is 90%, only main.ts is not covered
  * Controller and service are both at 100%
* Keyboard navigation is okay but I haven't tested accessibility in general
* I have only tested it in Edge and Firefox