import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Editors} from 'react-data-grid-addons';
import TypeField from './FieldType';

class FieldTypeCell extends Editors.SimpleTextEditor {

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
      handleValueChange: onCommit,
      fullWidth: true,
      isTabular: true,
    };

    return <TypeField {...subProps} />;
  }
}

FieldTypeCell.propTypes = {
  options: PropTypes.array,
  column: Editors.CheckboxEditor.propTypes.column,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  rowData: PropTypes.object,
};

export default FieldTypeCell;
