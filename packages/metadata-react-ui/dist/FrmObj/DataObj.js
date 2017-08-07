'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GridList = require('material-ui/GridList');

var _reactFlexLayout = require('../FlexPanel/react-flex-layout/react-flex-layout');

var _reactFlexLayout2 = _interopRequireDefault(_reactFlexLayout);

var _reactFlexLayoutSplitter = require('../FlexPanel/react-flex-layout/react-flex-layout-splitter');

var _reactFlexLayoutSplitter2 = _interopRequireDefault(_reactFlexLayoutSplitter);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _DataField = require('../DataField');

var _DataField2 = _interopRequireDefault(_DataField);

var _TabularSection = require('../TabularSection');

var _TabularSection2 = _interopRequireDefault(_TabularSection);

var _DataObj = require('./DataObj.scss');

var _DataObj2 = _interopRequireDefault(_DataObj);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataObj extends _react.Component {

  constructor(props) {
    super(props);
    const metadata = this.props._obj._manager.metadata();

    this.state = {
      fields: metadata.fields || {},
      tabularSections: metadata.tabular_sections || {}
    };
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

  /**
   * Render part with fields.
   * @return {Element}
   */
  renderFields() {
    const elements = [];

    for (const fieldName in this.state.fields) {
      elements.push(_react2.default.createElement(
        'div',
        { key: fieldName, className: _DataObj2.default.field },
        _react2.default.createElement(_DataField2.default, { _obj: this.props._obj, _fld: fieldName })
      ));
    }

    if (elements.length === 0) {
      return null;
    }

    return _react2.default.createElement(
      _Paper2.default,
      { style: Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_FIELDS) },
      _react2.default.createElement(
        'div',
        { className: _DataObj2.default.fields },
        elements
      )
    );
  }

  /**
   * Render part with tabular sections.
   * @return {Element} [description]
   */
  renderTabularSections() {
    const elements = [];
    const style = Object.assign({}, DataObj.PAPER_STYLE, DataObj.PAPER_STYLE_TABULAR_SECTION);

    for (const tabularSectionName in this.state.tabularSections) {
      elements.push(_react2.default.createElement(
        _Paper2.default,
        { key: tabularSectionName, style: style },
        _react2.default.createElement(_TabularSection2.default, { _obj: this.props._obj, _tabular: tabularSectionName })
      ));
    }

    if (elements.length === 0) {
      return null;
    }

    return _react2.default.createElement(
      'div',
      { className: _DataObj2.default.tabularSections },
      elements
    );
  }

  render() {
    if (!this.props._obj) {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: _DataObj2.default.progress })
      );
    }

    return _react2.default.createElement(
      'div',
      { className: "content-with-toolbar-layout" },
      _react2.default.createElement(
        'div',
        { className: "content-with-toolbar-layout__toolbar" },
        _react2.default.createElement(_Toolbar2.default, {
          handleSave: this.handleSave.bind(this),
          handleSend: this.handleSend.bind(this),
          handleMarkDeleted: this.handleMarkDeleted.bind(this),
          handlePrint: this.handlePrint.bind(this),
          handleAttachment: this.handleAttachment.bind(this),
          handleClose: this.props.handleClose })
      ),
      _react2.default.createElement(
        'div',
        { className: "content-with-toolbar-layout__content" },
        this.renderFields(),
        this.renderTabularSections()
      )
    );
  }
}
exports.default = DataObj;
DataObj.PAPER_STYLE = {
  margin: "10px"
};
DataObj.PAPER_STYLE_FIELDS = {
  padding: "10px"
};
DataObj.PAPER_STYLE_TABULAR_SECTION = {
  height: "100%"
};
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