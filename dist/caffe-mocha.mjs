import _ from 'lodash';
import chai from 'chai';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();















var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var expect = chai.expect;

var generateCase = function generateCase(_ref) {
  var name = _ref.name,
      kase = _ref.kase,
      defaults$$1 = _ref.defaults;

  var handler = kase.skip || defaults$$1.skip ? it.skip : it;

  handler(name, function () {
    var expectation = kase.expectation || defaults$$1.expectation;
    var method = kase.method || defaults$$1.method;
    var args = kase.args || defaults$$1.args;
    var comparison = kase.comparison || defaults$$1.comparison;

    var value = method.apply(undefined, toConsumableArray(args));

    expect(comparison(value, expectation)).to.be.true;
  });
};

var generateSection = function generateSection(_ref2) {
  var name = _ref2.name,
      section = _ref2.section,
      _ref2$parentDefaults = _ref2.parentDefaults,
      parentDefaults = _ref2$parentDefaults === undefined ? {} : _ref2$parentDefaults;

  var cases = section.cases;
  var subSections = section.sections;
  var defaults$$1 = _.merge(_.cloneDeep(parentDefaults), section.defaults);

  describe(name, function () {
    if (cases) {
      _.each(cases, function (kase, caseName) {
        generateCase({
          name: caseName,
          kase: kase,
          defaults: defaults$$1
        });
      });
    }

    if (subSections) {
      _.each(subSections, function (subSection, subSectionName) {
        generateSection({
          name: subSectionName,
          section: subSection,
          parentDefaults: defaults$$1
        });
      });
    }
  });
};

var run = function run(tests) {
  var sections = tests.sections;

  if (sections) {
    _.each(sections, function (section, sectionName) {
      generateSection({
        name: sectionName,
        section: section,
        parentDefaults: tests.defaults
      });
    });
  }
};

var caffe = {
  run: run
};

export default caffe;
//# sourceMappingURL=caffe-mocha.mjs.map
