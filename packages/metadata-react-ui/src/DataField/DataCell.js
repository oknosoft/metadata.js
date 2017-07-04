import React, {Component} from "react";
import PropTypes from 'prop-types';
import DataField from "./DataField";


const ExcelColumn = {
  name: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  filterable: PropTypes.bool
};

class DataCell extends Component {

  static contextTypes = {
    $p: PropTypes.object.isRequired
  }

  static propTypes = {
    options: PropTypes.array,
    column: PropTypes.shape(ExcelColumn),
    value: PropTypes.array
  }

  // props.column.key, props.rowData(._row)

  constructor(props, context) {

    super(props, context)

    this.state = {
      value: [],
      _meta: props._meta || props.rowData._metadata(props.column.key)
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  getValue() {
    let updated = {};
    updated[this.props.column.key] = this.state.value;
    return updated;
  }

  handleSelectChange(value) {
    this.setState({value});
  }

  render() {

    const {$p} = this.context;

    const _obj = this.props.rowData;
    const _fld = this.props.column.key
    const _val = _obj[_fld];
    const subProps = {
      _meta: this.state._meta,
      _obj: _obj,
      _fld: _fld,
      _val: _val,
      label_position: $p.enm.label_positions.hide,
      handleValueChange: this.handleSelectChange
    }

    return (
      <DataField ref={node => this.node = node} {...subProps} />
    );
  }
}

export default DataCell;
