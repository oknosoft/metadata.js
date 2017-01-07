"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _DataField = require("./DataField");

var _DataField2 = _interopRequireDefault(_DataField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ExcelColumn = {
  name: _react2.default.PropTypes.string.isRequired,
  key: _react2.default.PropTypes.string.isRequired,
  width: _react2.default.PropTypes.number.isRequired,
  filterable: _react2.default.PropTypes.bool
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

  getInputNode() {
    return _reactDom2.default.findDOMNode(this);
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
      label_position: $p.UI.LABEL_POSITIONS.hide,
      handleValueChange: this.handleSelectChange
    };

    return _react2.default.createElement(_DataField2.default, subProps);
  }
}

DataCell.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
DataCell.propTypes = {
  options: _react2.default.PropTypes.array,
  column: _react2.default.PropTypes.shape(ExcelColumn),
  value: _react2.default.PropTypes.array
};
exports.default = DataCell;