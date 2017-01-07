'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Tabs = require('material-ui/Tabs');

var _Paper = require('material-ui/Paper');

var _Paper2 = _interopRequireDefault(_Paper);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _Divider = require('material-ui/Divider');

var _Divider2 = _interopRequireDefault(_Divider);

var _DataField = require('components/DataField');

var _DataField2 = _interopRequireDefault(_DataField);

var _CircularProgress = require('material-ui/CircularProgress');

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _CnnSettings = require('./CnnSettings');

var _CnnSettings2 = _interopRequireDefault(_CnnSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabsUser extends _react.Component {

  constructor(props) {

    super(props);

    this.tabChange = tab_value => {
      if (tab_value === 'a' || tab_value === 'b') {
        this.setState({
          tab_value: tab_value
        });
      }
    };

    this.handleLogOut = () => {
      this.props.handleLogOut();
    };

    this.state = {
      tab_value: 'a',
      btn_login_disabled: !props.login || !props.password
    };
  }

  handleSave() {}

  handleSend() {}

  handleMarkDeleted() {}

  handlePrint() {}

  handleAttachment() {}

  render() {

    const { props } = this;

    return _react2.default.createElement(
      'div',
      { className: 'meta-paper' },
      this.props._obj ? _react2.default.createElement(
        _Paper2.default,
        { zDepth: 3, rounded: false },
        _react2.default.createElement(
          _Tabs.Tabs,
          {
            value: this.state.tab_value,
            onChange: this.tabChange
          },
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u041F\u0440\u043E\u0444\u0438\u043B\u044C', value: 'a' },
            _react2.default.createElement(
              'div',
              { className: 'meta-padding-18' },
              _react2.default.createElement(
                'div',
                { className: 'meta-padding-8' },
                _react2.default.createElement(_DataField2.default, { _obj: this.props._obj, _fld: 'id' }),
                _react2.default.createElement(_DataField2.default, { _obj: this.props._obj, _fld: 'name' })
              ),
              _react2.default.createElement('br', null),
              _react2.default.createElement(_Divider2.default, null),
              _react2.default.createElement(_RaisedButton2.default, { label: '\u0412\u044B\u0439\u0442\u0438',
                className: 'meta-button-18-0',
                onTouchTap: this.handleLogOut })
            )
          ),
          _react2.default.createElement(
            _Tabs.Tab,
            { label: '\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435', value: 'b' },
            _react2.default.createElement(_CnnSettings2.default, props)
          )
        )
      ) : _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_CircularProgress2.default, { size: 120, thickness: 5, className: 'meta-progress' })
      )
    );
  }
}
exports.default = TabsUser;
TabsUser.propTypes = {

  zone: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
  couch_path: _react.PropTypes.string.isRequired,
  enable_save_pwd: _react.PropTypes.bool.isRequired,
  handleSetPrm: _react.PropTypes.func.isRequired,

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