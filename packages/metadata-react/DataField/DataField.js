/**
 * ### Абстрактное поле ввода
 * Тип элемента управления вычисляется по метаданным поля
 *
 * @module DataField
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import {FieldWithMeta} from './AbstractField';
import FieldSelect from './FieldSelect';
import FieldInfinit from './FieldInfinit';
import FieldText from './FieldText';
import FieldDate from './FieldDate';
import FieldNumber from './FieldNumber';
import FieldToggle from './FieldToggle';

import control_by_type from 'metadata-abstract-ui/src/ui';


export default class DataField extends FieldWithMeta {

  render() {

    const {_meta, props} = this;
    const {_obj, _fld} = props;

    switch (control_by_type(_meta.type, _obj[_fld])) {

    case 'ocombo':
      return <FieldInfinit {...props} />;

    case 'oselect':
      return <FieldSelect {...props} />;

    case 'calck':
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
