'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _IconButton = require('material-ui/IconButton');

var _IconButton2 = _interopRequireDefault(_IconButton);

var _filterList = require('material-ui/svg-icons/content/filter-list');

var _filterList2 = _interopRequireDefault(_filterList);

var _Dialog = require('material-ui/Dialog');

var _Dialog2 = _interopRequireDefault(_Dialog);

var _FlatButton = require('material-ui/FlatButton');

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _DatePicker = require('material-ui/DatePicker');

var _DatePicker2 = _interopRequireDefault(_DatePicker);

var _DataSelection = require('./DataSelection.scss');

var _DataSelection2 = _interopRequireDefault(_DataSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataSelection = function (_Component) {
  _inherits(DataSelection, _Component);

  function DataSelection() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DataSelection);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DataSelection.__proto__ || Object.getPrototypeOf(DataSelection)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      open: false
    }, _this.handleOpen = function () {
      _this.setState({ open: true });
    }, _this.handleClose = function () {
      _this.setState({ open: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DataSelection, [{
    key: 'render',
    value: function render() {

      var actions = [_react2.default.createElement(_FlatButton2.default, {
        label: 'Ok',
        primary: true,
        keyboardFocused: true,
        onTouchTap: this.handleClose
      })];

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _IconButton2.default,
          { touch: true, tooltip: '\u0424\u0438\u043B\u044C\u0442\u0440', onTouchTap: this.handleOpen },
          _react2.default.createElement(_filterList2.default, null)
        ),
        _react2.default.createElement(
          _Dialog2.default,
          {
            title: '\u041E\u0442\u0431\u043E\u0440 \u043D\u0435 \u0437\u0430\u0434\u0430\u043D',
            actions: actions,
            modal: false,
            open: this.state.open,
            onRequestClose: this.handleClose
          },
          '\u041E\u0442\u0431\u043E\u0440 \u0434\u043B\u044F \u0434\u0430\u043D\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430 \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F.',
          _react2.default.createElement(_DatePicker2.default, { hintText: '\u041F\u0435\u0440\u0438\u043E\u0434' })
        )
      );
    }
  }]);

  return DataSelection;
}(_react.Component);

DataSelection.propTypes = {
  selectionChange: _react.PropTypes.func.isRequired,
  selectionValue: _react.PropTypes.object.isRequired
};
exports.default = DataSelection;