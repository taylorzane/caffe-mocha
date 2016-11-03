# Caffè Mocha

A semi-opinionated wrapper for the mocha test suite.

Caffè Mocha allows you to spend less time writing boilerplate and more time testing, and developing.

# Getting Started

0. Install Caffè Mocha:

```sh
yarn add --dev caffe-mocha
# OR
npm install -D caffe-mocha
```

0. Set up your test cases:

```js
// test/lib/my-methods.js
import caffe from 'caffe-mocha'

import myMethods from '../my-methods-module'

const testCases = {
  sections: {
    'Foo': {
      sections: {
        'Bar': {
          cases: {
            'bar should foo baz': {
              expectation: 'bazFoo',
              method: myMethods.bar,
              args: ['baz'],
              comparison: (a, b) => a === b
            },
            'bar should not foo qux': {
              expectation: 'qux',
              method: myMethods.bar,
              args: ['qux'],
              comparison: (a, b) => a === b,
              skip: true
            }
          }
        }
      }
    }
  }
}

caffe.run(testCases)
```

0. Run your test cases:

```sh
mocha test/lib/my-methods.js
# OR
mocha --compilers js:babel-register test/lib/my-methods.js # FOR ES6 MODULES (ABOVE)
```

0. DRY up your test cases with defaults:

```js
// test/lib/my-methods.js
import caffe from 'caffe-mocha'

import myMethods from '../my-methods-module'

const testCases = {
  defaults: {
    comparison: (a, b) => a === b
  },
  sections: {
    'Foo': {
      sections: {
        'Bar': {
          defaults: {
            method: myMethods.bar
          },
          cases: {
            'bar should foo baz': {
              expectation: 'bazFoo',
              args: ['baz']
            },
            'bar should not foo qux': {
              expectation: 'qux',
              args: ['qux'],
              skip: true
            }
          }
        }
      }
    }
  }
}

caffe.run(testCases)
```

# Documentation

## Tree Structure

A fully populated tree looks like this (with expected types):

```js
const testCases = {
  defaults: {
    expectation: Any,
    method: Function,
    args: Array<Any>,
    comparison: Function || String,
    skip: Boolean
  },
  sections: {
    'Section 1': {
      defaults: {
        expectation: Any,
        method: Function,
        args: Array<Any>,
        comparison: Function || String,
        skip: Boolean
      },
      sections: {
        'Section 1 A': {
          defaults: {
            expectation: Any,
            method: Function,
            args: Array<Any>,
            comparison: Function || String,
            skip: Boolean
          },
          sections: { /* ad infinum */ },
          cases: {
            'Case 1': {
              expectation: Any,
              method: Function,
              args: Array<Any>,
              comparison: Function || String,
              skip: Boolean
            }
          }
        }
      },
      cases: {
        'Case 1': {
          expectation: Any,
          method: Function,
          args: Array<Any>,
          comparison: Function || String,
          skip: Boolean
        }
      }
    }
  }
}
```

## Available Properties

The following properties are available:

- `defaults`
  - An object that allows the user to define defaults in order to DRY up test cases, it is most useful for sub-sections that are all using the same method.
  - The available properties for the `defaults` object are
    - `expectation`: The value that the output of `method` will be compared against.
    - `method`: The function/method that will accept `args`, and return a value to compare against `expectation`.
    - `args`: An array of arguments to be passed to `method`.
    - `comparison`: The function/method that will compare the output of `method` and `expectation`. This can also be a string to easily do `==` or `>=` (etc) checks.
    - `skip`: A boolean that determines whether a section/case should be skipped (this will still output the test case name like `describe.skip` or `it.skip` does.)
  - A `defaults` object may exist at the root level.
  - A `defaults` object may only exist at any level that `sections` or `cases` exists.
  - A `defaults` object may not exist at a level that is describing sections (see below)

    ```js
    // This is not a valid configuration. This will create a `defaults` scope in mocha
    // but will not run any test cases as there is no `sections` or `cases` property.
    const testCases = {
      sections: {
        defaults: {
          method: myMethod
        }
        'Foo': {
          /* etc */
        }
      }
    }
    ```

  - A `defaults` object will merge all previous levels of `defaults`.
  - A `defaults` object deeper in the tree will overwrite any properties defined higher up.

- `sections`
  - An object that scopes test cases, or other sections.
  - The available properties for the `sections` object are
    - Any valid key: This value may even be `sections`, `defaults`, or `cases`, as those properties can not exist at this level.
  - A `sections` object must exist at the root level.
  - A `sections` object may exist at any level that is not describing section names, as this would interpret `sections` as the name of a literal section.

- `cases`
  - An object that contains all test cases for the current section.
  - The available properties for the `cases` object are
    - Any valid key: This value may even be `sections`, `defaults`, or `cases`, as those properties can not exist at this level.
  - A `cases` object must not exist at the root level.
  - A `cases` object may only exist in a defined section.

- Section
  - An object that may define defaults, and test cases.
  - The available properties for a section object are
    - `defaults`: The object that defines default values for test cases.
    - `cases`: The object that defines test cases.
  - A section object must not exist at the root level.
  - A section object may only exist in a `sections` object. Any other location will cause the section to be discarded.

- Case
  - An object that defines a specific test case.
  - The available properties for a case object are
    - `expectation`: The value that the output of `method` will be compared against.
    - `method`: The function/method that will accept `args`, and return a value to compare against `expectation`.
    - `args`: An array of arguments to be passed to `method`.
    - `comparison`: The function/method that will compare the output of `method` and `expectation`. This can also be a string to easily do `==` or `>=` (etc) checks.
    - `skip`: A boolean that determines whether a case should be skipped (this will still output the test case name like `it.skip` does.)
  - A case object must not exist at the root level.
  - A case object may only exist in a `cases` object. Any other location will cause the case to be discarded.

## Methods

The following methods are exposed to the user:

- `caffe.run(testCases)`
  - This will generate and run the pre-defined test cases.


# TODO

- [ ] Add handling for
  - [ ] `before`
  - [ ] `beforeEach`
  - [ ] `after`
  - [ ] `afterEach`
- [ ] Add ability to use async `done()`
  - [ ] Add `async` property to case and `defaults` object
  - [ ] Add `timeout` property to case and `defaults` object
  - [ ] Add `slow` property to case and `defaults` object
  - [ ] Add handling to pass `done` to the method
