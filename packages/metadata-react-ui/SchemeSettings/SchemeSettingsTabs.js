"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Tabs = require("material-ui/Tabs");

var _TabularSection = require("../TabularSection");

var _TabularSection2 = _interopRequireDefault(_TabularSection);

var _SchemeSettingsSelect = require("./SchemeSettingsSelect");

var _SchemeSettingsSelect2 = _interopRequireDefault(_SchemeSettingsSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### Табы сохраненных настроек
 * По умолчанию, приклеены к диалогу, но их можно расположить где угодно
 *
 * @module SchemeSettings
 *
 * Created 19.12.2016
 */

class SchemeSettingsTabs extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      tab_value: 'p'
    }, this.handleTabChange = tab_value => {
      this.setState({ tab_value });
    }, _temp;
  }

  render() {

    const { handleSchemeChange, scheme, tabParams } = this.props;

    return _react2.default.createElement(
      _Tabs.Tabs,
      {
        value: this.state.tab_value,
        onChange: this.handleTabChange
      },
      _react2.default.createElement(
        _Tabs.Tab,
        { label: "\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B", value: "p" },
        tabParams ? tabParams : _react2.default.createElement(_TabularSection2.default, {
          _obj: scheme,
          _tabular: "params",
          minHeight: 140
        }),
        _react2.default.createElement(_TabularSection2.default, {
          _obj: scheme,
          _tabular: "selection",
          minHeight: 140,

          rowSelection: {
            showCheckbox: true,
            enableShiftSelect: true,
            selectBy: {
              keys: {
                rowKey: "field",
                markKey: "use",
                values: scheme.used_fields()
              }
            }
          }

        })
      ),
      _react2.default.createElement(
        _Tabs.Tab,
        { label: "\u041A\u043E\u043B\u043E\u043D\u043A\u0438", value: "c" },
        _react2.default.createElement(_TabularSection2.default, {
          _obj: scheme,
          _tabular: "fields",
          deny_add_del: true,
          minHeight: 328,

          rowSelection: {
            showCheckbox: true,
            enableShiftSelect: true,
            selectBy: {
              keys: {
                rowKey: "field",
                markKey: "use",
                values: scheme.used_fields()
              }
            }
          }
        })
      ),
      _react2.default.createElement(
        _Tabs.Tab,
        { label: "\u0413\u0440\u0443\u043F\u043F\u0438\u0440\u043E\u0432\u043A\u0430", value: "g" },
        _react2.default.createElement(_TabularSection2.default, {
          _obj: scheme,
          _tabular: "dimensions",
          minHeight: 140
        }),
        _react2.default.createElement(_TabularSection2.default, {
          _obj: scheme,
          _tabular: "resources",
          minHeight: 140
        })
      ),
      _react2.default.createElement(
        _Tabs.Tab,
        { label: "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430", value: "s" },
        _react2.default.createElement(_TabularSection2.default, {
          _obj: scheme,
          _tabular: "sorting",
          minHeight: 328
        })
      ),
      _react2.default.createElement(
        _Tabs.Tab,
        { label: "\u0412\u0430\u0440\u0438\u0430\u043D\u0442", value: "v" },
        _react2.default.createElement(_SchemeSettingsSelect2.default, {
          scheme: scheme,
          handleSchemeChange: handleSchemeChange,
          minHeight: 376
        })
      )
    );
  }

}
exports.default = SchemeSettingsTabs;
SchemeSettingsTabs.propTypes = {
  scheme: _react.PropTypes.object.isRequired,
  handleSchemeChange: _react.PropTypes.func.isRequired,
  tabParams: _react.PropTypes.object
};