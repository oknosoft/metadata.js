import React, { Component, PropTypes } from 'react';
import ReactDataGrid from 'react-data-grid';


export default class TabularSection extends Component {

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  static propTypes = {

    _obj: PropTypes.object.isRequired,
    _tabular: PropTypes.string.isRequired,
    _meta: PropTypes.object,

    handleValueChange: PropTypes.func,
    handleRowChange: PropTypes.func,
  }

  constructor (props, context) {

    super(props);

    const users_mgr = context.$p.cat.users

    this.state = {
      _meta: props._meta || props._obj._metadata(props._tabular),
      _tabular: props._obj[props._tabular],
      _columns: [
        {
          key: 'row',
          name: '№',
          resizable : true,
          width : 80
        },
        {
          key: 'individual_person',
          name: 'ФИО',
          resizable : true,
          formatter: v => {
            v = users_mgr.get(v.value)
            return (<div>{v instanceof Promise ? 'loading...' : v.presentation}</div>)
          }
        }]
    }
  }

  rowGetter(i){
    return this.state._tabular.get(i)._obj;
  }

  render() {

    const { $p } = this.context;
    const { _meta, _tabular, _columns } = this.state;
    const _val = this.props._obj[this.props._fld];
    const subProps = {
      _meta: this.state._meta,
      _obj: this.props._obj,
      _fld: this.props._fld,
      _val: _val
    }

    return <ReactDataGrid
      columns={_columns}
      rowGetter={::this.rowGetter}
      rowsCount={_tabular.count()}
      minHeight={140} />
  }
}
