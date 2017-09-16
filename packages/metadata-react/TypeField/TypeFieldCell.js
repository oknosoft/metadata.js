import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {Editors} from 'react-data-grid-addons';
import TypeField from './TypeField';

const ExcelColumn = {
  name: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  filterable: PropTypes.bool,
};

class TypeFieldCell extends Editors.SimpleTextEditor {

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

    return <TypeField {...subProps} />;
  }
}

TypeFieldCell.propTypes = {
  options: PropTypes.array,
  column: PropTypes.shape(ExcelColumn),
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  rowData: PropTypes.object,
};

export default TypeFieldCell;
