/**
 * ### Поле ввода пути к данным в табчасти
 *
 * Created by Evgeniy Malyarov on 18.09.2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Editors} from 'metadata-external/react-data-grid-addons.min';
import PathField from './FieldPath';

class FieldPathCell extends Editors.SimpleTextEditor {

  // props.column.key, props.rowData(._row)

  getValue() {
    const {column, rowData} = this.props;
    return {[column.key]: rowData[column.key]};
  }

  render() {

    const {rowData, column, onCommit} = this.props;
    const subProps = {
      _obj: rowData,
      _fld: column.key,
      defaultValue: rowData[column.key],
      label_position: $p.enm.label_positions.hide,
      popupVisible: true,
      handleValueChange: onCommit,
    };

    return <PathField {...subProps} />;
  }
}

FieldPathCell.propTypes = {
  options: PropTypes.array,
  column: Editors.CheckboxEditor.propTypes.column,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  rowData: PropTypes.object,
};

export default FieldPathCell;
