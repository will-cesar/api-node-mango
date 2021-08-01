# API NodeJs Mango

> API NodeJS with Clean Architecture and TDD by youtube channel Mango</br>
> Link playlist tutorial: https://youtube.com/playlist?list=PL9aKtVrF05DyEwK5kdvzrYXFdpZfj1dsG

## About

> API using Clean Architecture and TDD

## Tech Stack

- [**Husky**](https://www.npmjs.com/package/husky)
- [**Jest**](https://jestjs.io/pt-BR/)
- [**Lint-staged**](https://github.com/okonet/lint-staged)
- [**Node.js**](https://nodejs.org/en/)
- [**StandardJS**](https://standardjs.com)

## Comands (scripts)

- npm run pre-commit
  - Run the lint-staged. 
  - This script are created to husky run this before make a commit.
  - Lint-staged ensure the code is on pattern of StandardJS.

- npm test
  - Execute tests in application with a few rules

- npm run test:unit
  - Run the script "npm test" with some additional rules

- npm run test:staged 
  - Execute tests with different rules in relation to "npm test".
  - This script are created to husky run this before make a commit.

- npm run test:ci
  - Execute tests with report.
  - This report show to us if the test coverage all files in the application or not.
  - This script are used in CI (Continuous Integration)