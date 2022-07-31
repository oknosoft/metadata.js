import React from 'react';
import DataCell from './DataCell';
import PathField from './FieldPath';

class DataCellTyped extends DataCell {

  constructor(props, context) {
    super(props, context);

    const {rowData, column} = props;
    const {type_str} = this;
    const mgr = type_str && $p.md.mgr_by_class_name(type_str);

    if(mgr) {
      const {_meta} = this.state;
      this.state._meta = Object.assign({}, _meta, {type: {
          is_ref: true,
          types: [type_str],
        }});
      this.proxyData = {
        get [column.key]() {
          return mgr.get(rowData[column.key]);
        },
        set [column.key](v) {
          rowData[column.key] = v;
        }
      }
    }
  }

  get type_str() {
    const {rowData, column} = this.props;
    return rowData[`${column.key}_type`];
  }

  is_path() {
    return this.type_str === 'path';
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
        fullWidth: true,
        isTabular: true,
      };
      return <PathField {...subProps} />;
    }
    return super.render();
  }
}

export default DataCellTyped;
