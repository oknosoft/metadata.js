"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _DumbLoader = require("../DumbLoader");

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

var _RepToolbar = require("./RepToolbar");

var _RepToolbar2 = _interopRequireDefault(_RepToolbar);

var _RepTabularSection = require("./RepTabularSection");

var _RepTabularSection2 = _interopRequireDefault(_RepTabularSection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Report extends _MetaComponent2.default {

  constructor(props, context) {

    super(props, context);

    _initialiseProps.call(this);

    const { $p } = context;
    const { _obj } = props;
    const _tabular = props._tabular || "data";

    this.state = {
      _tabular,
      _meta: _obj._metadata(_tabular)
    };

    $p.cat.scheme_settings.get_scheme(_obj._manager.class_name + `.${_tabular}`).then(this.handleSchemeChange);
  }

  // обработчик при изменении настроек компоновки


  render() {

    const { props, state, handleSave, handlePrint, handleSchemeChange } = this;
    const { _obj, height, width, handleClose, TabParams } = props;
    const { _columns, scheme, _tabular } = state;

    if (!scheme) {
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u0427\u0442\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
    } else if (!_obj) {
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u0427\u0442\u0435\u043D\u0438\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u0430 \u0434\u0430\u043D\u043D\u044B\u0445..." });
    } else if (!_columns || !_columns.length) {
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
    }

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(_RepToolbar2.default, {
        handleSave: handleSave,
        handlePrint: handlePrint,
        handleClose: handleClose,

        _obj: _obj,
        _tabular: _tabular,
        _columns: _columns,

        TabParams: TabParams,

        scheme: scheme,
        handleSchemeChange: handleSchemeChange

      }),
      _react2.default.createElement(
        "div",
        { className: "meta-padding-8", style: { width: width - 20, height: height - 50 } },
        _react2.default.createElement(_RepTabularSection2.default, {
          ref: "data",
          _obj: _obj,
          _tabular: _tabular,
          _columns: _columns,
          minHeight: height - 60
        })
      )
    );
  }
}
exports.default = Report;
Report.propTypes = {
  _obj: _propTypes2.default.object, // объект данных - отчет DataProcessorObj
  _tabular: _propTypes2.default.string, // имя табчасти, в которой живут данные отчета
  _acl: _propTypes2.default.string.isRequired, // права текущего пользователя

  TabParams: _propTypes2.default.func, // внешний компонент страницы параметров - транслируется в RepToolbar

  handlePrint: _propTypes2.default.func, // внешний обработчик печати
  handleSchemeChange: _propTypes2.default.func // внешний обработчик при изменении настроек компоновки

};

var _initialiseProps = function () {
  this.handleSave = () => {

    const { scheme } = this.state;

    this.props._obj.calculate(this.state._columns).then(() => {
      this.refs.data.setState({ groupBy: scheme.dims() });
    });
  };

  this.handlePrint = () => {};

  this.handleSchemeChange = scheme => {

    const { props, state } = this;
    const { _obj, handleSchemeChange } = props;
    const _columns = scheme.rx_columns({
      mode: "ts",
      fields: state._meta.fields,
      _obj: _obj
    });

    if (handleSchemeChange) {
      handleSchemeChange.call(this, scheme);
    }

    this.setState({
      scheme,
      _columns
    });
  };
};