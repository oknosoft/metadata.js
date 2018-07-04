Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _pure = require('recompose/pure');

var _pure2 = _interopRequireDefault(_pure);

var _SvgIcon = require('@material-ui/core/SvgIcon');

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ref = _react2.default.createElement('path', { d: 'M20,16V4H8V16H20M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z' });

var CheckboxMultipleBlankOutline = function CheckboxMultipleBlankOutline(props) {
  return _react2.default.createElement(
    _SvgIcon2.default,
    props,
    _ref
  );
};

CheckboxMultipleBlankOutline = (0, _pure2.default)(CheckboxMultipleBlankOutline);
CheckboxMultipleBlankOutline.muiName = 'SvgIcon';

exports.default = CheckboxMultipleBlankOutline;
