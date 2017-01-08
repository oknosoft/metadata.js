'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FieldSelect = require('./FieldSelect');

var _FieldSelect2 = _interopRequireDefault(_FieldSelect);

var _FieldText = require('./FieldText');

var _FieldText2 = _interopRequireDefault(_FieldText);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataField extends _react.Component {

  constructor(props, context) {

    super(props, context);

    this.state = {
      _meta: props._meta || props._obj._metadata(props._fld)
    };
  }

  render() {

    const { $p } = this.context;
    const { _meta } = this.state;
    const { _obj, _fld, handleValueChange, label_position } = this.props;
    const _val = _obj[_fld];
    const subProps = {
      _meta: _meta,
      _obj: _obj,
      _fld: _fld,
      handleValueChange: handleValueChange
    };

    let control;

    switch ($p.UI.control_by_type(this.state._meta.type, _val)) {

      case 'ocombo':
        control = _react2.default.createElement(_FieldSelect2.default, subProps);
        break;

      default:
        control = _react2.default.createElement(_FieldText2.default, subProps);

    }

    if (label_position == $p.enm.label_positions.hide) {
      return control;
    } else {
      return _react2.default.createElement(
        'div',
        { className: 'meta-datafield-field' },
        _react2.default.createElement(
          'div',
          { className: 'meta-datafield-label' },
          _meta.synonym
        ),
        _react2.default.createElement(
          'div',
          { className: 'meta-datafield-data' },
          control
        )
      );
    }
  }
}
exports.default = DataField;
DataField.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
DataField.propTypes = {
  _obj: _react.PropTypes.object.isRequired, // DataObj, к реквизиту которого будет привязано поле
  _fld: _react.PropTypes.string.isRequired, // имя поля объекта - путь к данным
  _meta: _react.PropTypes.object, // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

  label_position: _react.PropTypes.object, // положение заголовка, $p.enm.label_positions
  read_only: _react.PropTypes.bool, // поле только для чтения
  mandatory: _react.PropTypes.bool, // поле обязательно для заполнения
  multi: _react.PropTypes.bool, // множественный выбор - значение является массивом
  handleValueChange: _react.PropTypes.func // обработчик при изменении значения в поле
};