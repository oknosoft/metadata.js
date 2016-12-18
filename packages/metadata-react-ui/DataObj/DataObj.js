'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GridList = require('material-ui/GridList');

var _reactFlexLayout = require('../react-flex-layout/react-flex-layout');

var _reactFlexLayout2 = _interopRequireDefault(_reactFlexLayout);

var _reactFlexLayoutSplitter = require('../react-flex-layout/react-flex-layout-splitter');

var _reactFlexLayoutSplitter2 = _interopRequireDefault(_reactFlexLayoutSplitter);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _DataField = require('components/DataField');

var _DataField2 = _interopRequireDefault(_DataField);

var _TabularSection = require('../TabularSection');

var _TabularSection2 = _interopRequireDefault(_TabularSection);

var _DataObj = require('./DataObj.scss');

var _DataObj2 = _interopRequireDefault(_DataObj);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataObj extends _react.Component {

  constructor(props) {

    super(props);

    this.state = {};
  }

  handleSave() {

    this.props.handleSave(this.props._obj);
  }

  handleSend() {

    this.props.handleSave(this.props._obj);
  }

  handleMarkDeleted() {}

  handlePrint() {}

  handleAttachment() {}

  handleValueChange(_fld) {
    return (event, value) => {
      const { _obj, handleValueChange } = this.props;
      const old_value = _obj[_fld];
      _obj[_fld] = value || (event && event.target ? event.target.value : '');
      handleValueChange(_fld, old_value);
    };
  }

  render() {

    const { width, height, _obj } = this.props;

    return _obj ? _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_Toolbar2.default, {
        handleSave: this.handleSave.bind(this),
        handleSend: this.handleSend.bind(this),
        handleMarkDeleted: this.handleMarkDeleted.bind(this),
        handlePrint: this.handlePrint.bind(this),
        handleAttachment: this.handleAttachment.bind(this),
        handleClose: this.props.handleClose
      }),
      _react2.default.createElement('div', { className: _DataObj2.default.cont, style: { width } })
    ) : _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: _DataObj2.default.progress })
    );
  }
}
exports.default = DataObj;
DataObj.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
DataObj.propTypes = {
  _obj: _react.PropTypes.object, // DataObj, с которым будет связан компонент
  _acl: _react.PropTypes.string.isRequired, // Права на чтение-изменение

  read_only: _react.PropTypes.object, // Элемент только для чтения

  handleSave: _react.PropTypes.func,
  handleRevert: _react.PropTypes.func,
  handleMarkDeleted: _react.PropTypes.func,
  handlePost: _react.PropTypes.func,
  handleUnPost: _react.PropTypes.func,
  handlePrint: _react.PropTypes.func,
  handleAttachment: _react.PropTypes.func,
  handleValueChange: _react.PropTypes.func,
  handleAddRow: _react.PropTypes.func,
  handleDelRow: _react.PropTypes.func
};