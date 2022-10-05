## Equal Experts groceries assignment
### Version number `5b8d0fd276b6d288905ed2f63a934e057e8feca2`

https://equalexperts.github.io/ee-tech-interviews-uk/grocery-list-problem.html

Deliverable:
* Basic grocery list comprising a backend API and a web frontend with Equal Experts branding

Objectives:
* Unit tests and test coverage
* Simplicity
* Self-explanatory code

Tech decisions:
* Tests first
* Hold data in memory or supabase if time allows
* Start with a single CRUD list, add multiple lists if time allows
* Provide a test coverage report if time allows
* Integrate EE colours instead of just the logo if time allows

Justifications:

* I used npx create-react-app to have a solid base that has an integrated test runner
* I included both the front end and back end code in a single repo for simplicity but I did not waste time setting the project up as a monorepo with nx or lerna, I think an sh script is sufficient in this case
* No TypeScript - I think there's a place for TypeScript in bigger projects but it didn't feel necessary in this case
* I used Grommet for a component library to save time styling my own components.
  * Initially I wanted to use Adobe Spectrum because I really like the default look of the components but drag & drop is in RC phase and not fully released yet

Additional considerations:

* Accessibility is okay-ish with keyboard navigation but I have not tested the app with screen readers
* ESLint is not picking up tests for some reason unless you run it manually so I've added it to build and test scripts in package.json. It's not perfect but it works.
