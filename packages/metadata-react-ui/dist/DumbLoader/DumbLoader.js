"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CircularProgress = require("material-ui/CircularProgress");

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _DumbLoader = require("./DumbLoader.scss");

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DumbLoader extends _react.Component {

  render() {
    return _react2.default.createElement(
      "div",
      { className: _DumbLoader2.default.dumbLoader },
      _react2.default.createElement(
        "div",
        { className: _DumbLoader2.default.progress, style: { position: 'relative', width: 300 } },
        this.props.title
      ),
      _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: _DumbLoader2.default.progress })
    );
  }
}
exports.default = DumbLoader;
DumbLoader.propTypes = {
  step: _propTypes2.default.number,
  step_size: _propTypes2.default.number,
  count_all: _propTypes2.default.number,

  title: _propTypes2.default.string,
  processed: _propTypes2.default.string,
  current: _propTypes2.default.string,
  bottom: _propTypes2.default.string
};
DumbLoader.defaultProps = {
  title: "Заставка загрузка модулей..."
};