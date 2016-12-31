'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _DataSelection = require('./SchemeSettings.scss');

var _DataSelection2 = _interopRequireDefault(_DataSelection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataSelection extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      open: false
    }, this.handleOpen = () => {
      this.setState({ open: true });
    }, this.handleClose = () => {
      this.setState({ open: false });
    }, _temp;
  }

  render() {

    const actions = [_react2.default.createElement(_FlatButton2.default, {
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

}
exports.default = DataSelection;
DataSelection.propTypes = {
  selectionChange: _react.PropTypes.func.isRequired,
  selectionValue: _react.PropTypes.object.isRequired
};