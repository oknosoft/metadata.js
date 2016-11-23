'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _GridList = require('material-ui/GridList');

var _reactFlexLayout = require('../../react-flex-layout/react-flex-layout');

var _reactFlexLayout2 = _interopRequireDefault(_reactFlexLayout);

var _reactFlexLayoutSplitter = require('../../react-flex-layout/react-flex-layout-splitter');

var _reactFlexLayoutSplitter2 = _interopRequireDefault(_reactFlexLayoutSplitter);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _DataField = require('../DataField');

var _DataField2 = _interopRequireDefault(_DataField);

var _TabularSection = require('../TabularSection');

var _TabularSection2 = _interopRequireDefault(_TabularSection);

var _DataObj = require('./DataObj.scss');

var _DataObj2 = _interopRequireDefault(_DataObj);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    padding: '8px'
  },
  block: {
    //flex: '1 100%',
    fontWeight: 'bold'
  }
};

var DataObj = function (_Component) {
  _inherits(DataObj, _Component);

  function DataObj(props) {
    _classCallCheck(this, DataObj);

    var _this = _possibleConstructorReturn(this, (DataObj.__proto__ || Object.getPrototypeOf(DataObj)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(DataObj, [{
    key: 'handleSave',
    value: function handleSave() {

      this.props.handleSave(this.props._obj);
    }
  }, {
    key: 'handleSend',
    value: function handleSend() {

      this.props.handleSave(this.props._obj);
    }
  }, {
    key: 'handleMarkDeleted',
    value: function handleMarkDeleted() {}
  }, {
    key: 'handlePrint',
    value: function handlePrint() {}
  }, {
    key: 'handleAttachment',
    value: function handleAttachment() {}
  }, {
    key: 'handleValueChange',
    value: function handleValueChange(_fld) {
      var _this2 = this;

      return function (event, value) {
        var _props = _this2.props,
            _obj = _props._obj,
            handleValueChange = _props.handleValueChange;

        var old_value = _obj[_fld];
        _obj[_fld] = value || (event && event.target ? event.target.value : '');
        handleValueChange(_fld, old_value);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var screen = this.context.screen;
      var _obj = this.props._obj;


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
        _react2.default.createElement(
          'div',
          { className: _DataObj2.default.cont, style: { width: screen.width } },
          _react2.default.createElement(
            'div',
            { style: styles.block },
            _obj.presentation,
            ', \u0437\u0430\u044F\u0432\u0438\u0442\u0435\u043B\u044C: ',
            _obj.partner.presentation
          ),
          _react2.default.createElement(
            _reactFlexLayout2.default,
            { layoutWidth: screen.width - 24, layoutHeight: screen.height - 140 },
            _react2.default.createElement(
              _reactFlexLayout2.default,
              { layoutWidth: 'flex' },
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041D\u0430\u0447\u0430\u043B\u043E\u041F\u0435\u0440\u0438\u043E\u0434\u0430', handleValueChange: this.handleValueChange("НачалоПериода") }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041A\u043E\u043D\u0435\u0446\u041F\u0435\u0440\u0438\u043E\u0434\u0430', handleValueChange: this.handleValueChange("КонецПериода") }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E\u0414\u043D\u0435\u0439', handleValueChange: this.handleValueChange("КоличествоДней") }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'note', handleValueChange: this.handleValueChange("note") }),
              _react2.default.createElement(_TabularSection2.default, { _obj: _obj, _tabular: 'guests' })
            ),
            _react2.default.createElement(_reactFlexLayoutSplitter2.default, null),
            _react2.default.createElement(
              _reactFlexLayout2.default,
              { layoutWidth: Math.floor((screen.width - 24) / 3) },
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u0421\u0430\u043D\u0430\u0442\u043E\u0440\u0438\u0439', handleValueChange: this.handleValueChange("Санаторий") }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u041F\u0443\u0442\u0435\u0432\u043A\u0438', handleValueChange: this.handleValueChange("КатегорияПутевки") }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044F\u041D\u043E\u043C\u0435\u0440\u0430', handleValueChange: this.handleValueChange("КатегорияНомера") }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E\u041C\u0435\u0441\u0442\u0417\u0430\u0431\u0440\u043E\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u043E', disabled: true }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E\u041C\u0435\u0441\u0442\u041E\u0442\u043A\u0430\u0437\u0430\u043D\u043E', disabled: true }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: '\u0410\u043A\u0442\u0443\u0430\u043B\u044C\u043D\u043E\u0435\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E\u041C\u0435\u0441\u0442', disabled: true }),
              _react2.default.createElement(_DataField2.default, { _obj: _obj, _fld: 'organization', handleValueChange: this.handleValueChange("organization") })
            )
          )
        )
      ) : _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: _DataObj2.default.progress })
      );
    }
  }]);

  return DataObj;
}(_react.Component);

DataObj.contextTypes = {
  screen: _react2.default.PropTypes.object.isRequired
};
DataObj.propTypes = {
  _obj: _react.PropTypes.object,
  _acl: _react.PropTypes.string.isRequired,

  handleSave: _react.PropTypes.func.isRequired,
  handleRevert: _react.PropTypes.func.isRequired,
  handleMarkDeleted: _react.PropTypes.func.isRequired,
  handlePost: _react.PropTypes.func.isRequired,
  handleUnPost: _react.PropTypes.func.isRequired,
  handlePrint: _react.PropTypes.func.isRequired,
  handleAttachment: _react.PropTypes.func.isRequired,
  handleValueChange: _react.PropTypes.func.isRequired,
  handleAddRow: _react.PropTypes.func.isRequired,
  handleDelRow: _react.PropTypes.func.isRequired
};
exports.default = DataObj;