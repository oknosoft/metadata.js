import React from 'react';
import DataCell from './DataCell';
import PathField from './FieldPath';

class DataCellTyped extends DataCell {

  constructor(props, context) {
    super(props, context);
    const {rowData, column} = props;
    const type = rowData[`${column.key}_type`];
    const mgr = $p.md.mgr_by_class_name(type);
    if(mgr) {
      const {_meta} = this.state;
      this.state._meta = Object.assign({}, _meta, {type: {
          is_ref: true,
          types: [type],
        }});
    }
  }

  is_path() {
    const {rowData, column} = this.props;
    return rowData[`${column.key}_type`] === 'path';
  }

  getValue() {
    const {props: {column, rowData}, state} = this;
    return  {[column.key]: this.is_path() ? rowData[column.key] : state.value};
  }

  render() {
    if(this.is_path()) {
      const {rowData, column, onCommit} = this.props;
      const subProps = {
        _obj: rowData,
        _fld: column.key,
        defaultValue: rowData[column.key],
        label_position: $p.enm.label_positions.hide,
        handleValueChange: onCommit,
      };
      return <PathField {...subProps} />;
    }
    return super.render();
  }
}

export default DataCellTyped;
