"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _DataField = require("./DataField");

var _DataField2 = _interopRequireDefault(_DataField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExcelColumn = {
  name: _react2.default.PropTypes.string.isRequired,
  key: _react2.default.PropTypes.string.isRequired,
  width: _react2.default.PropTypes.number.isRequired,
  filterable: _react2.default.PropTypes.bool
};

var DataCell = function (_Component) {
  _inherits(DataCell, _Component);

  // props.column.key, props.rowData(._row)

  function DataCell(props) {
    _classCallCheck(this, DataCell);

    var _this = _possibleConstructorReturn(this, (DataCell.__proto__ || Object.getPrototypeOf(DataCell)).call(this, props));

    _this.state = {
      value: [],
      _meta: props._meta || props.rowData._metadata(props.column.key)
    };
    _this.handleSelectChange = _this.handleSelectChange.bind(_this);
    return _this;
  }

  _createClass(DataCell, [{
    key: "getInputNode",
    value: function getInputNode() {
      return _reactDom2.default.findDOMNode(this);
    }
  }, {
    key: "getValue",
    value: function getValue() {
      var updated = {};
      updated[this.props.column.key] = this.state.value;
      return updated;
    }
  }, {
    key: "handleSelectChange",
    value: function handleSelectChange(value) {
      this.setState({ value: value });
    }
  }, {
    key: "render",
    value: function render() {
      var $p = this.context.$p;


      var _obj = this.props.rowData;
      var _fld = this.props.column.key;
      var _val = _obj[_fld];
      var subProps = {
        _meta: this.state._meta,
        _obj: _obj,
        _fld: _fld,
        _val: _val,
        label_position: $p.UI.LABEL_POSITIONS.hide,
        handleValueChange: this.handleSelectChange
      };

      return _react2.default.createElement(_DataField2.default, subProps);
    }
  }]);

  return DataCell;
}(_react.Component);

DataCell.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
DataCell.propTypes = {
  options: _react2.default.PropTypes.array.isRequired,
  column: _react2.default.PropTypes.shape(ExcelColumn),
  value: _react2.default.PropTypes.array
};
exports.default = DataCell;