"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _CircularProgress = require("material-ui/CircularProgress");

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _DumbLoader = require("./DumbLoader.scss");

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DumbLoader extends _react.Component {

  render() {

    let { title } = this.props;

    if (title == undefined) title = "Заставка загрузка модулей...";

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        "div",
        { className: _DumbLoader2.default.progress, style: { position: 'relative', width: 300 } },
        title
      ),
      _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: _DumbLoader2.default.progress })
    );
  }
}
exports.default = DumbLoader;
DumbLoader.propTypes = {
  step: _react.PropTypes.number,
  step_size: _react.PropTypes.number,
  count_all: _react.PropTypes.number,

  title: _react.PropTypes.string,
  processed: _react.PropTypes.string,
  current: _react.PropTypes.string,
  bottom: _react.PropTypes.string
};