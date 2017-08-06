/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module DataField
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FieldSelect from './FieldSelect';
import FieldText from './FieldText';
import FieldDate from './FieldDate';
import FieldNumber from './FieldNumber';
import FieldToggle from './FieldToggle';

import control_by_type from 'metadata-abstract-ui/src/ui';

export default class DataField extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    label_position: PropTypes.object,   // положение заголовка, $p.enm.label_positions
    read_only: PropTypes.bool,          // поле только для чтения
    mandatory: PropTypes.bool,          // поле обязательно для заполнения
    multi: PropTypes.bool,              // множественный выбор - значение является массивом
    handleValueChange: PropTypes.func   // обработчик при изменении значения в поле
  };

  constructor(props, context) {

    super(props, context);

    this.state = {
      _meta: props._meta || props._obj._metadata(props._fld),
    };
  }

  render() {

    const {state, props} = this;
    const {_obj, _fld} = props;
    const _val = _obj[_fld];
    const subProps = Object.assign({}, props, state);

    let Control;

    switch (control_by_type(state._meta.type, _val)) {

    case 'ocombo':
      Control = FieldSelect;
      break;

    case 'calck':
    case 'edn':
      Control = FieldNumber;
      break;

    case 'dhxCalendar':
      Control = FieldDate;
      break;

    case 'ch':
      Control = FieldToggle;
      break;

    default:
      Control = FieldText;

    }

    return <Control {...subProps} />;
  }
}
