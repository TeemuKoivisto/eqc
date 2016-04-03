"use strict";

var _test = require("./test2");

window.eqc = _test.YlaLuokka;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TestiLuokka = exports.TestiLuokka = function () {
  function TestiLuokka() {
    _classCallCheck(this, TestiLuokka);

    this.name = "asdf";
  }

  _createClass(TestiLuokka, [{
    key: "metodi",
    value: function metodi() {
      return this.name;
    }
  }]);

  return TestiLuokka;
}();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YlaLuokka = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _test = require("./test");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YlaLuokka = exports.YlaLuokka = function (_TestiLuokka) {
  _inherits(YlaLuokka, _TestiLuokka);

  function YlaLuokka() {
    _classCallCheck(this, YlaLuokka);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(YlaLuokka).call(this));
  }

  _createClass(YlaLuokka, [{
    key: "ylametodi",
    value: function ylametodi() {
      return 0;
    }
  }]);

  return YlaLuokka;
}(_test.TestiLuokka);
//# sourceMappingURL=eqc.js.map
