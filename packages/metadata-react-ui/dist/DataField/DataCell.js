"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DataField = require("./DataField");

var _DataField2 = _interopRequireDefault(_DataField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ExcelColumn = {
  name: _propTypes2.default.string.isRequired,
  key: _propTypes2.default.string.isRequired,
  width: _propTypes2.default.number.isRequired,
  filterable: _propTypes2.default.bool
};

class DataCell extends _react.Component {

  // props.column.key, props.rowData(._row)

  constructor(props, context) {

    super(props, context);

    this.state = {
      value: [],
      _meta: props._meta || props.rowData._metadata(props.column.key)
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  getValue() {
    let updated = {};
    updated[this.props.column.key] = this.state.value;
    return updated;
  }

  handleSelectChange(value) {
    this.setState({ value });
  }

  render() {

    const { $p } = this.context;

    const _obj = this.props.rowData;
    const _fld = this.props.column.key;
    const _val = _obj[_fld];
    const subProps = {
      _meta: this.state._meta,
      _obj: _obj,
      _fld: _fld,
      _val: _val,
      label_position: $p.enm.label_positions.hide,
      handleValueChange: this.handleSelectChange
    };

    return _react2.default.createElement(_DataField2.default, _extends({ ref: node => this.node = node }, subProps));
  }
}

DataCell.contextTypes = {
  $p: _propTypes2.default.object.isRequired
};
DataCell.propTypes = {
  options: _propTypes2.default.array,
  column: _propTypes2.default.shape(ExcelColumn),
  value: _propTypes2.default.array };
exports.default = DataCell;