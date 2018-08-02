/**
 * Редактор табчасти свойств с видами сравнений, как поле табчасти
 *
 * @module FieldPropsCell
 *
 * Created by Evgeniy Malyarov on 13.07.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Editors} from 'metadata-external/react-data-grid-addons.min';
import FieldProps from './FieldProps';

class FieldPropsCell extends Editors.SimpleTextEditor {

  // props.column.key, props.rowData(._row)

  getValue() {
    const {column, rowData} = this.props;
    return {[column.key]: rowData[column.key]};
  }

  onBlur = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
  };

  render() {

    const {rowData, column, onCommit} = this.props;
    const subProps = {
      _obj: rowData,
      _fld: column.key,
      label_position: $p.enm.label_positions.hide,
      handleValueChange: onCommit,
    };

    return <div onBlur={this.onBlur}>
      <input
        type="text"
        disabled
        placeholder="Свойства"
        value=""
      />
      <FieldProps {...subProps} />
    </div>;
  }
}

FieldPropsCell.propTypes = {
  options: PropTypes.array,
  column: Editors.CheckboxEditor.propTypes.column,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  rowData: PropTypes.object,
};

export default FieldPropsCell;
