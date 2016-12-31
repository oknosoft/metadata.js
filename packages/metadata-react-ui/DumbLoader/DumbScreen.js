'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

class DumbScreen extends _react.Component {

  render() {

    let { title, img, page } = this.props;

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
}
exports.default = DumbScreen;
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