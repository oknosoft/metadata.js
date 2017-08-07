"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _DataListField = require("../DataListField");

var _DataListField2 = _interopRequireDefault(_DataListField);

var _DataField = require("../DataField");

var _DataField2 = _interopRequireDefault(_DataField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### Панель параметрв
 *
 * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 *
 * @module RepParams
 *
 * Created 09.01.2017
 */

class RepParams extends _MetaComponent2.default {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.handleValueChange = () => {
      const { _obj, scheme } = this.props;
      scheme.date_from = _obj.period_from;
      scheme.date_till = _obj.period_till;
    }, _temp;
  }

  render() {

    const { _obj, minHeight } = this.props;

    return _react2.default.createElement(
      "div",
      { style: { height: '356px', marginTop: '16px' } },
      _react2.default.createElement(_DataField2.default, {
        _obj: _obj,
        _fld: "period_from",
        handleValueChange: this.handleValueChange
      }),
      _react2.default.createElement(_DataField2.default, {
        _obj: _obj,
        _fld: "period_till",
        handleValueChange: this.handleValueChange
      })
    );
  }
}
exports.default = RepParams;
RepParams.propTypes = {
  _obj: _react.PropTypes.object.isRequired, // DataObj (отчет)
  minHeight: _react.PropTypes.number,
  handleCustom: _react.PropTypes.func };