/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module DataField
 *
 */

import React, {Component, PropTypes} from "react";
import MetaComponent from "../common/MetaComponent";
import FieldSelect from "./FieldSelect";
import FieldText from "./FieldText";
import FieldDate from "./FieldDate";
import FieldNumber from "./FieldNumber";
import FieldToggle from "./FieldToggle";

export default class DataField extends MetaComponent {

  static propTypes = {
    _obj: PropTypes.object.isRequired,  // DataObj, к реквизиту которого будет привязано поле
    _fld: PropTypes.string.isRequired,  // имя поля объекта - путь к данным
    _meta: PropTypes.object,            // метаданные поля - могут быть переопределены снаружи, если не указано, будут задейтвованы стандартные метаданные

    label_position: PropTypes.object,   // положение заголовка, $p.enm.label_positions
    read_only: PropTypes.bool,          // поле только для чтения
    mandatory: PropTypes.bool,          // поле обязательно для заполнения
    multi: PropTypes.bool,              // множественный выбор - значение является массивом
    handleValueChange: PropTypes.func   // обработчик при изменении значения в поле
  }

  constructor(props, context) {

    super(props, context)

    this.state = {
      _meta: props._meta || props._obj._metadata(props._fld)
    }
  }

  render() {

    const {$p} = this.context;
    const {_meta} = this.state;
    const {_obj, _fld, handleValueChange, label_position} = this.props;
    const _val = _obj[_fld];
    const subProps = {
      _meta: _meta,
      _obj: _obj,
      _fld: _fld,
      handleValueChange: handleValueChange
    }

    let Control

    switch ($p.UI.control_by_type(_meta.type, _val)) {

      case 'ocombo':
        Control = FieldSelect
        break;

      case 'calck':
      case 'edn':
        Control = FieldNumber
        break;

      case 'dhxCalendar':
        Control = FieldDate
        break;

      case 'ch':
        Control = FieldToggle
        break;

      default:
        Control = FieldText

    }

    if (label_position == $p.enm.label_positions.hide) {
      return <Control {...subProps} />

    } else {
      return (
        <div className={'meta-datafield-field'}>
          <div className={'meta-datafield-label'}>{_meta.synonym}</div>
          <div className={'meta-datafield-data'}>
            <Control {...subProps} />
          </div>
        </div>
      )
    }
  }
}
