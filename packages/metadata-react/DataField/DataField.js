/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module DataField
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import AbstractField from './AbstractField';
import FieldSelect from './FieldSelect';
import FieldInfinit from './FieldInfinit';
import FieldText from './FieldText';
import FieldDate from './FieldDate';
import FieldNumber from './FieldNumber';
import FieldToggle from './FieldToggle';

import control_by_type from 'metadata-abstract-ui/src/ui';


export default class DataField extends AbstractField {

  render() {

    const {_meta, props} = this;
    const {_obj, _fld} = props;

    let Control;

    switch (control_by_type(_meta.type, _obj[_fld])) {

    case 'ocombo':
      return <FieldInfinit {...props} />;

    case 'calck':
    case 'edn':
      return <FieldNumber {...props} />;

    case 'dhxCalendar':
      return <FieldDate {...props} />;

    case 'ch':
      return <FieldToggle {...props} />;

    default:
      return <FieldText {...props} />;

    }
  }
}
