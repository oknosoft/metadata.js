"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SchemeSettingsTabs = undefined;
exports.getTabsContent = getTabsContent;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Tabs = require("material-ui/Tabs");

var _TabularSection = require("../TabularSection");

var _TabularSection2 = _interopRequireDefault(_TabularSection);

var _SchemeSettingsSelect = require("./SchemeSettingsSelect");

var _SchemeSettingsSelect2 = _interopRequireDefault(_SchemeSettingsSelect);

var _DataField = require("../DataField");

var _DataField2 = _interopRequireDefault(_DataField);

var _Divider = require("material-ui/Divider");

var _Divider2 = _interopRequireDefault(_Divider);

var _SchemeSettingsTabs = require("./styles/SchemeSettingsTabs.scss");

var _SchemeSettingsTabs2 = _interopRequireDefault(_SchemeSettingsTabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * ### Табы сохраненных настроек
 * По умолчанию, приклеены к диалогу, но их можно расположить где угодно
 *
 * @module SchemeSettings
 *
 * Created 19.12.2016
 */

function getTabsContent(scheme, handleSchemeChange, tabParams) {
  return {
    "Параметры": tabParams ? tabParams : scheme.query.match('date') ? _react2.default.createElement(
      "div",
      { style: { height: 356 } },
      _react2.default.createElement(_DataField2.default, { _obj: scheme, _fld: "date_from" }),
      _react2.default.createElement(_DataField2.default, { _obj: scheme, _fld: "date_till" })
    ) : _react2.default.createElement(_TabularSection2.default, { _obj: scheme, _tabular: "params", minHeight: 308 }),

    "Колонки": _react2.default.createElement(_TabularSection2.default, { _obj: scheme, _tabular: "fields", deny_add_del: true, minHeight: 308,
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
      } }),

    "Отбор": _react2.default.createElement(_TabularSection2.default, { _obj: scheme, _tabular: "selection", minHeight: 308,
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
      } }),

    "Группировка": _react2.default.createElement(
      "div",
      { className: _SchemeSettingsTabs2.default.groups },
      _react2.default.createElement(
        "div",
        { className: _SchemeSettingsTabs2.default.groupDimensions },
        _react2.default.createElement(_TabularSection2.default, { _obj: scheme, _tabular: "dimensions", minHeight: 130 })
      ),
      _react2.default.createElement(
        "div",
        { className: _SchemeSettingsTabs2.default.groupResources },
        _react2.default.createElement(_TabularSection2.default, { _obj: scheme, _tabular: "resources", minHeight: 130 })
      )
    ),

    "Сортировка": _react2.default.createElement(_TabularSection2.default, { _obj: scheme, _tabular: "sorting", minHeight: 308 }),

    "Вариант": _react2.default.createElement(_SchemeSettingsSelect2.default, { scheme: scheme, handleSchemeChange: handleSchemeChange, minHeight: 356 })
  };
}

/**
 * Wrapper for tabs whitch returned function above.
 */
class SchemeSettingsTabs extends _react.Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.state = {
      tab_value: 0
    }, this.handleTabChange = tab_value => {
      this.setState({
        tab_value
      });
    }, _temp;
  }

  render() {
    const tabs = getTabsContent(this.props.scheme, this.props.handleSchemeChange, this.props.tabParams);

    // если панель параметров передали снаружи, показываем её
    // если в scheme.query есть 'date', показываем выбор периода
    // по умолчанию, показываем табчать параметров

    const elements = [];
    let tabIndex = 0;

    for (const tabName in tabs) {
      if (Object.prototype.hasOwnProperty.apply(tabs, [tabName]) === false) {
        continue;
      }

      elements.push(_react2.default.createElement(
        _Tabs.Tab,
        { label: tabName, value: tabIndex++, key: tabIndex },
        tabs[tabName]
      ));
    }

    return _react2.default.createElement(
      _Tabs.Tabs,
      { value: this.state.tab_value, onChange: this.handleTabChange },
      elements
    );
  }
}
exports.SchemeSettingsTabs = SchemeSettingsTabs;
SchemeSettingsTabs.propTypes = {
  scheme: _propTypes2.default.object.isRequired,
  handleSchemeChange: _propTypes2.default.func.isRequired,
  tabParams: _propTypes2.default.object
};