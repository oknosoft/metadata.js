'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _Toggle = require('material-ui/Toggle');

var _Toggle2 = _interopRequireDefault(_Toggle);

var _Divider = require('material-ui/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CnnSettings = function (_Component) {
  _inherits(CnnSettings, _Component);

  function CnnSettings(props) {
    _classCallCheck(this, CnnSettings);

    var _this = _possibleConstructorReturn(this, (CnnSettings.__proto__ || Object.getPrototypeOf(CnnSettings)).call(this, props));

    _this.state = {
      zone: props.zone,
      couch_path: props.couch_path,
      enable_save_pwd: props.enable_save_pwd
    };
    return _this;
  }

  _createClass(CnnSettings, [{
    key: 'handleSetPrm',
    value: function handleSetPrm() {
      var _state = this.state,
          zone = _state.zone,
          couch_path = _state.couch_path,
          enable_save_pwd = _state.enable_save_pwd;

      this.props.handleSetPrm({ zone: zone, couch_path: couch_path, enable_save_pwd: enable_save_pwd });
    }
  }, {
    key: 'valueToState',
    value: function valueToState(name) {
      var _this2 = this;

      return function (event) {
        return _this2.setState(_defineProperty({}, name, event.target.value));
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: 'meta-padding-18' },
        _react2.default.createElement(_TextField2.default, {
          floatingLabelText: '\u041E\u0431\u043B\u0430\u0441\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0445',
          hintText: 'zone',
          fullWidth: true,
          onChange: this.valueToState("zone"),
          value: this.state.zone }),
        _react2.default.createElement(_TextField2.default, {
          floatingLabelText: '\u0410\u0434\u0440\u0435\u0441 CouchDB',
          hintText: 'couch_path',
          fullWidth: true,
          onChange: this.valueToState("couch_path"),
          value: this.state.couch_path }),
        _react2.default.createElement(_Toggle2.default, {
          label: '\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F',
          className: 'meta-toggle',
          onToggle: function onToggle() {
            return _this3.setState({ enable_save_pwd: !_this3.state.enable_save_pwd });
          },
          toggled: this.state.enable_save_pwd }),
        _react2.default.createElement(_Divider2.default, null),
        _react2.default.createElement(_RaisedButton2.default, { label: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
          className: 'meta-button-18-0',
          onTouchTap: this.handleSetPrm.bind(this) })
      );
    }
  }]);

  return CnnSettings;
}(_react.Component);

CnnSettings.propTypes = {
  zone: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
  couch_path: _react.PropTypes.string.isRequired,
  enable_save_pwd: _react.PropTypes.bool.isRequired,
  handleSetPrm: _react.PropTypes.func.isRequired
};
exports.default = CnnSettings;