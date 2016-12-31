'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

class CnnSettings extends _react.Component {

  constructor(props) {

    super(props);

    this.state = {
      zone: props.zone,
      couch_path: props.couch_path,
      enable_save_pwd: props.enable_save_pwd
    };
  }

  handleSetPrm() {
    const { zone, couch_path, enable_save_pwd } = this.state;
    this.props.handleSetPrm({ zone, couch_path, enable_save_pwd });
  }

  valueToState(name) {
    return event => this.setState({ [name]: event.target.value });
  }

  render() {

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
        onToggle: () => this.setState({ enable_save_pwd: !this.state.enable_save_pwd }),
        toggled: this.state.enable_save_pwd }),
      _react2.default.createElement(_Divider2.default, null),
      _react2.default.createElement(_RaisedButton2.default, { label: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        className: 'meta-button-18-0',
        onTouchTap: this.handleSetPrm.bind(this) })
    );
  }
}
exports.default = CnnSettings;
CnnSettings.propTypes = {
  zone: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
  couch_path: _react.PropTypes.string.isRequired,
  enable_save_pwd: _react.PropTypes.bool.isRequired,
  handleSetPrm: _react.PropTypes.func.isRequired
};