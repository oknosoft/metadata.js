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

    this.handleSetPrm = () => {
      this.props.handleSetPrm(this.state);
    };

    const { zone, couch_path, enable_save_pwd, couch_suffix, couch_direct } = props;
    this.state = { zone, couch_path, couch_suffix, enable_save_pwd, couch_direct };
  }

  valueToState(name) {
    return event => this.setState({ [name]: event.target.value });
  }

  render() {

    const { zone, couch_path, enable_save_pwd, couch_suffix, couch_direct } = this.state;

    return _react2.default.createElement(
      'div',
      { className: 'meta-padding-18' },
      _react2.default.createElement(_TextField2.default, {
        floatingLabelText: '\u0410\u0434\u0440\u0435\u0441 CouchDB',
        hintText: 'couch_path',
        fullWidth: true,
        onChange: this.valueToState("couch_path"),
        value: couch_path }),
      _react2.default.createElement(_TextField2.default, {
        floatingLabelText: '\u041E\u0431\u043B\u0430\u0441\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0445',
        hintText: 'zone',
        fullWidth: true,
        onChange: this.valueToState("zone"),
        value: zone }),
      _react2.default.createElement(_TextField2.default, {
        floatingLabelText: '\u0421\u0443\u0444\u0444\u0438\u043A\u0441 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F',
        hintText: 'couch_suffix',
        fullWidth: true,
        onChange: this.valueToState("couch_suffix"),
        value: couch_suffix }),
      _react2.default.createElement(_Toggle2.default, {
        label: '\u041F\u0440\u044F\u043C\u043E\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0431\u0435\u0437 \u043A\u0435\u0448\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F',
        className: 'meta-toggle',
        onToggle: () => this.setState({ couch_direct: !couch_direct }),
        toggled: couch_direct }),
      _react2.default.createElement(_Toggle2.default, {
        label: '\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0430\u0440\u043E\u043B\u044F',
        className: 'meta-toggle',
        onToggle: () => this.setState({ enable_save_pwd: !enable_save_pwd }),
        toggled: enable_save_pwd }),
      _react2.default.createElement(_Divider2.default, null),
      _react2.default.createElement(_RaisedButton2.default, { label: '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438',
        className: 'meta-button-18-0',
        onTouchTap: this.handleSetPrm })
    );
  }
}
exports.default = CnnSettings;
CnnSettings.propTypes = {
  zone: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
  couch_path: _react.PropTypes.string.isRequired,
  couch_suffix: _react.PropTypes.string.isRequired,
  couch_direct: _react.PropTypes.bool,
  enable_save_pwd: _react.PropTypes.bool,
  handleSetPrm: _react.PropTypes.func.isRequired
};