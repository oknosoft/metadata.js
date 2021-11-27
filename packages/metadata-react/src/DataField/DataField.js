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
import FieldCheckbox from './FieldCheckbox';
import FieldThreeState from './FieldThreeState';

import control_by_type from 'metadata-abstract-ui/ui';


export default class DataField extends FieldWithMeta {

  render() {

    const {_meta, props} = this;
    let {_obj, _fld, ctrl_type: Component} = props;
    if(!Component && _meta.Editor) {
      Component = _meta.Editor;
    }
    if(!Component || (typeof Component !== 'function' && typeof Component.Naked !== 'function')) {
      const value = _obj[_fld];
      if(!Component && value && value._manager && value._manager.Editor) {
        Component = value._manager.Editor;
      }
      else {
        const type = Component || control_by_type(_meta.type, value, _meta.list);
        switch (type) {
        case 'ocombo':
          Component = FieldInfinit;
          break;
        case 'oselect':
        case 'dselect':
          Component = FieldSelect;
          break;
        case 'calck':
          Component = FieldNumber;
          break;
        case 'dhxCalendar':
          Component = FieldDate;
          break;
        case 'ch':
          Component = FieldToggle;
          break;
        case 'cb':
          Component = FieldCheckbox;
          break;
        case 'threestate':
          Component = FieldThreeState;
          break;
        default:
          Component = FieldText;
        }
      }
    }
    return <Component {...props} _meta={_meta} />;

  }
}

