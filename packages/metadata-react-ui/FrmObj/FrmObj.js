'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FrmObj = require('./FrmObj.scss');

var _FrmObj2 = _interopRequireDefault(_FrmObj);

var _DataObj = require('../DataObj');

var _DataObj2 = _interopRequireDefault(_DataObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FrmObj extends _react.Component {

  render() {
    return _react2.default.createElement(_DataObj2.default, this.props);
  }
}
exports.default = FrmObj;