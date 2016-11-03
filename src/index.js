import _ from 'lodash'
import chai from 'chai'
import safeEval from 'safe-eval'
const expect = chai.expect

const generateCase = ({ name, kase, defaults }) => {
  const handler = (kase.skip || defaults.skip) ? it.skip : it

  handler(name, () => {
    // Assign variables, fallback to defaults.
    const expectation = kase.expectation || defaults.expectation
    const method = kase.method || defaults.method
    const args = kase.args || defaults.args
    const comparison = kase.comparison || defaults.comparison

    const value = method(...args)

    switch (true) {
      case _.isString(comparison):
        expect(safeEval(`${value} ${comparison} ${expectation}`)).to.be.true
        break
      case _.isFunction(comparison):
        expect(comparison(value, expectation)).to.be.true
        break
      default: break
    }
  })
}

const generateSection = ({ name, section, parentDefaults = {} }) => {
  const cases = section.cases
  const subSections = section.sections
  const defaults = _.merge(_.cloneDeep(parentDefaults), section.defaults)

  describe(name, () => {
    if (cases) {
      _.each(cases, (kase, caseName) => {
        generateCase({
          name: caseName,
          kase,
          defaults
        })
      })
    }

    if (subSections) {
      _.each(subSections, (subSection, subSectionName) => {
        generateSection({
          name: subSectionName,
          section: subSection,
          parentDefaults: defaults
        })
      })
    }
  })
}

const run = tests => {
  const sections = tests.sections

  if (sections) {
    _.each(sections, (section, sectionName) => {
      generateSection({
        name: sectionName,
        section,
        parentDefaults: tests.defaults
      })
    })
  }
}

const caffe = {
  run
}

export default caffe
