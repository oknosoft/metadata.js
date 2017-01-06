import React, {Component} from "react";
import ReactDOM from "react-dom";
import DataField from "./DataField";


const ExcelColumn = {
  name: React.PropTypes.string.isRequired,
  key: React.PropTypes.string.isRequired,
  width: React.PropTypes.number.isRequired,
  filterable: React.PropTypes.bool
};

class DataCell extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {
    options: React.PropTypes.array,
    column: React.PropTypes.shape(ExcelColumn),
    value: React.PropTypes.array
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

  getInputNode() {
    return ReactDOM.findDOMNode(this);
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

    const { $p } = this.context;

    const _obj = this.props.rowData;
    const _fld = this.props.column.key
    const _val = _obj[_fld];
    const subProps = {
      _meta: this.state._meta,
      _obj: _obj,
      _fld: _fld,
      _val: _val,
      label_position: $p.UI.LABEL_POSITIONS.hide,
      handleValueChange: this.handleSelectChange
    }

    return (
      <DataField {...subProps} />
    );
  }
}

export default DataCell;
