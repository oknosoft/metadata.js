import React from 'react';
import PropTypes from 'prop-types';
import DataField from './DataField';

import {Editors} from 'react-data-grid-addons';

class DataCell extends Editors.SimpleTextEditor {

  // props.column.key, props.rowData(._row)

  constructor(props, context) {
    super(props, context);
    const {rowData, column, value, _meta} = props;
    this.state = {
      value: value || rowData[column.key],
      _meta: _meta || column._meta || {type: {types: ['string']}},
    };
  }

  getValue() {
    return {[this.props.column.key]: this.state.value};
  }

  handleSelectChange = (value) => {
    this.setState({value});
  };

  nodeRef = (node) => {
    this.node = node;
  };

  render() {

    const _obj = this.props.rowData;
    if(!_obj) {
      return <input ref={this.nodeRef} />;
    }

    const _fld = this.props.column.key;
    const subProps = {
      _obj,
      _fld,
      _val: _obj[_fld],
      _meta: this.state._meta,
      cell: this,
      ref: this.nodeRef,
      label_position: $p.enm.label_positions.hide,
      handleValueChange: this.handleSelectChange,
    };

    return <DataField {...subProps} />;
  }
}

DataCell.propTypes = {
  options: PropTypes.array,
  column: Editors.CheckboxEditor.propTypes.column,
  value: PropTypes.any,
  rowData: PropTypes.object,
  _meta: PropTypes.object,
};

export default DataCell;
