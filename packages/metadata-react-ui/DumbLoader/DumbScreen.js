'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _Divider = require('material-ui/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _Subheader = require('material-ui/Subheader');

var _Subheader2 = _interopRequireDefault(_Subheader);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _DumbLoader = require('./DumbLoader.scss');

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DumbScreen = function (_Component) {
  _inherits(DumbScreen, _Component);

  function DumbScreen() {
    _classCallCheck(this, DumbScreen);

    return _possibleConstructorReturn(this, (DumbScreen.__proto__ || Object.getPrototypeOf(DumbScreen)).apply(this, arguments));
  }

  _createClass(DumbScreen, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          title = _props.title,
          img = _props.img,
          page = _props.page;


      if (!title) title = "Заставка загрузка модулей...";

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: _DumbLoader2.default.progress, style: { position: 'relative', width: 300 } },
          title
        ),
        img,
        page ? _react2.default.createElement(
          'div',
          { className: _DumbLoader2.default.progress, style: { position: 'relative', width: 300 } },
          page.page
        ) : null
      );
    }
  }]);

  return DumbScreen;
}(_react.Component);

DumbScreen.propTypes = {
  step: _react.PropTypes.number,
  step_size: _react.PropTypes.number,
  count_all: _react.PropTypes.number,

  title: _react.PropTypes.string,
  processed: _react.PropTypes.string,
  current: _react.PropTypes.string,
  bottom: _react.PropTypes.string,
  page: _react.PropTypes.object
};
exports.default = DumbScreen;