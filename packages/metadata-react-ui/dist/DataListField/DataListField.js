"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _reactSelect = require("react-select");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Select from "../DataField/FieldVirtualizedSelect";


class DataListField extends _MetaComponent2.default {

  constructor(props, context) {

    super(props, context);

    _initialiseProps.call(this);

    const { _fld, _tabular } = props;
    const _meta = props._meta || _tabular._metadata(_fld);

    this.state = {
      _meta,
      _mgr: context.$p.utils.value_mgr({}, _fld, _meta.fields[_fld].type, false),
      options: [],
      value: _tabular.unload_column(_fld),
      multi: true
    };
  }

  render() {

    const { props, state, _loadOptions, _onChange } = this;
    const { _obj, _fld, label_position } = props;
    const { options, value, _meta } = state;

    const control = _react2.default.createElement(_reactSelect.Async, {
      name: _fld,
      multi: true,
      cache: false,
      clearable: false,
      labelKey: "presentation",
      valueKey: "ref",
      loadOptions: _loadOptions,
      minimumInput: 0,
      onChange: _onChange,
      options: options,
      value: value
    });

    if (label_position == this.context.$p.enm.label_positions.hide) {
      return control;
    } else {
      return _react2.default.createElement(
        "div",
        { className: 'meta-datafield-field' },
        _react2.default.createElement(
          "div",
          { className: 'meta-datafield-label' },
          _meta.synonym
        ),
        _react2.default.createElement(
          "div",
          { className: 'meta-datafield-data' },
          control
        )
      );
    }
  }
}
exports.default = DataListField; /**
                                  * ### React-component _Поле списка_
                                  * &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
                                  *
                                  * @module DataListField
                                  *
                                  * Created 09.01.2017
                                  */

DataListField.propTypes = {
  _tabular: _react.PropTypes.object.isRequired, // TabularSection, к которой будет привязано поле
  _fld: _react.PropTypes.string.isRequired, // имя колонки табчасти - путь к данным
  _meta: _react.PropTypes.object, // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

  label_position: _react.PropTypes.object, // положение заголовка, $p.enm.label_positions
  read_only: _react.PropTypes.bool, // поле только для чтения

  handleValueChange: _react.PropTypes.func // обработчик при изменении значения в поле
};

var _initialiseProps = function () {
  this._loadOptions = (input, callback) => {

    const selection = { _top: 40 };
    const { _fld, _meta } = this.props;
    const { _mgr } = this.state;

    if (input) {
      selection.presentation = { like: input };
    }
    if (_meta.choice_params) {
      _meta.choice_params.forEach(cp => {
        selection[cp.name] = cp.path;
      });
    }

    return _mgr.get_option_list(selection).then(options => {
      callback(null, {
        options: options,
        complete: true
      });
    });
  };

  this._onChange = value => {
    const { handleValueChange, _fld, _tabular } = this.props;
    this.setState({ value });

    // удаляем-добавляем строки в _tabular
    _tabular.load(value.map(row => ({ [_fld]: row })));

    if (handleValueChange) {
      handleValueChange(value);
    }
  };
};