module.exports = {
  root: true,
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module"
  },
  extends: "standard",
  "rules": {
    'prefer-const': 2,
    'arrow-parens': [2, 'as-needed'],
    'no-new-func': 0,
    'no-new': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'standard/object-curly-even-spacing': [2, 'always', {
      objectsInObjects: true
    }],
    'standard/array-bracket-even-spacing': [2, 'never']
  },
  "globals": {
    'after': true,
    'afterEach': true,
    'before': true,
    'beforeEach': true,
    'context': true,
    'describe': true,
    'it': true
  }
}
