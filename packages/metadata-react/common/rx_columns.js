/**
 * ### модификатор метод columns() справочника scheme_settings - добавляет форматтеры и редакторы
 *
 * @module rx_columns
 *
 * Created 10.01.2017
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DataCell from '../DataField/DataCell';
import FieldPathCell from '../DataField/FieldPathCell';
import {Formatters} from 'metadata-external/react-data-grid-addons.min';

const DropDownFormatter = Formatters.DropDownFormatter;


function rx_columns($p) {

  const {moment} = $p.utils;

  const date_formatter = {
    date: ({value}) => {
      const presentation = !value || value.length < 5 ? value || '' : moment(value).format(moment._masks.date);
      return <div title={presentation}>{presentation}</div>;
    },
    date_time: ({value}) => {
      const presentation = !value || value.length < 5 ? value || '' : moment(value).format(moment._masks.date_time);
      return <div title={presentation}>{presentation}</div>;
    }
  };

  const presentation_formatter = ({value}) => {
    let text = typeof value === 'string' ? value : (value && value.presentation) || '';
    if(text === '_') {
      text = '';
    }
    return <div title={text}>{text}</div>;
  };

  return function columns({mode, fields, _obj}) {

    const res = this.columns(mode);
    const {input, text, label, link, cascader, toggle, image, type, path} = $p.enm.data_field_kinds;

    if(fields) {
      res.forEach((column) => {

        const _fld = column._meta = fields[column.key];

        if(!column.formatter && _fld && _fld.type) {

          if(column.key === 'ref' || _fld.type.is_ref) {
            column.formatter = presentation_formatter;
          }
          else if(_fld.type.date_part) {
            column.formatter = date_formatter[_fld.type.date_part];
          }
        }

        let options;
        switch (column.ctrl_type) {

        case input:
        case text:
        case label:
        case link:
        case cascader:
          column.editable = true;
          break;

        case toggle:
          const toggle_options = [
            {
              id: 0,
              value: false,
              text: 'Нет',
              title: 'Нет',
            },
            {
              id: 1,
              value: true,
              text: 'Да',
              title: 'Да',
            }
          ];
          column.editor = <DropDownEditor options={toggle_options}/>;
          column.formatter = <DropDownFormatter options={toggle_options} value={''}/>;
          break;

        case path:
          // options = _obj.used_fields_list();
          // column.editor = <DropDownEditor options={options}/>;
          // column.formatter = <DropDownFormatter options={options} value=""/>;
          column.editor = <PathFieldCell/>;
          break;

        case type:
          column.editor = <TypeFieldCell/>;
          //column.formatter = <DropDownFormatter options={[]} value=""/>;
          break;

        default:
          column.editor = <DataCell/>;
        }

      });
    }

    return res;
  };
}

