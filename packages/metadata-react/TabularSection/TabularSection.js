import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReactDataGrid from 'react-data-grid';
import DataCell from '../DataField/DataCell';
import DefaultToolbar from './TabularSectionToolbar';
import {AutoSizer} from 'react-virtualized';
import DataFieldFactory from '../DataField/DataFieldFactory';
import LoadingMessage from '../DumbLoader/LoadingMessage';

// import withStyles from 'material-ui/styles/withStyles';
// import styles from './TabularSection.scss';

export default class TabularSection extends Component {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _tabular: PropTypes.string.isRequired,
    _meta: PropTypes.object,
    _columns: PropTypes.array,

    read_only: PropTypes.bool,            // Элемент только для чтения
    denyAddDel: PropTypes.bool,         // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    denyReorder: PropTypes.bool,         // Запрет изменения порядка строк
    minHeight: PropTypes.number,

    Toolbar: PropTypes.func,              // Конструктор индивидуальной панели инструментов. Если не указан, рисуем типовую

    handleValueChange: PropTypes.func,    // Обработчик изменения значения в ячейке
    handleRowChange: PropTypes.func,      // При окончании редактирования строки
    handleCustom: PropTypes.func,         // Внешний дополнительный подключаемый обработчик

    rowSelection: PropTypes.object,       // Настройка пометок строк

    selectedIds: PropTypes.array
  };

  static defaultProps = {
    denyAddDel: false,
    read_only: false
  };

  constructor(props, context) {
    super(props, context);
    const {_obj, _tabular} = props;
    const class_name = _obj._manager.class_name + '.' + _tabular;

    this.state = {
      _meta: props._meta || _obj._metadata(_tabular),
      _tabular: _obj[_tabular],
      _columns: props._columns || [],
      Toolbar: props.Toolbar || DefaultToolbar,
      selectedIds: props.rowSelection ? props.rowSelection.selectBy.keys.values : []
    };

    if(!this.state._columns.length) {
      $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange.bind(this));
    }
  }

  rowGetter = (i) => {
    return this.state._tabular.get(i);
  };

  handleRemove = () => {
    const {selected} = this._grid.state;
    if(selected && selected.hasOwnProperty('rowIdx')) {
      this.state._tabular.del(selected.rowIdx);
      this.forceUpdate();
    }
  };

  handleAdd = () => {
    this.state._tabular.add();
    this.forceUpdate();
  };

  handleUp = () => {
    const {selected} = this._grid.state;
    if(selected && selected.hasOwnProperty('rowIdx') && selected.rowIdx > 0) {
      this.state._tabular.swap(selected.rowIdx, selected.rowIdx - 1);
      selected.rowIdx = selected.rowIdx - 1;
      this.forceUpdate();
    }
  };

  handleDown = () => {
    const {selected} = this._grid.state;
    if(selected && selected.hasOwnProperty('rowIdx') && selected.rowIdx < this.state._tabular.count() - 1) {
      this.state._tabular.swap(selected.rowIdx, selected.rowIdx + 1);
      selected.rowIdx = selected.rowIdx + 1;
      this.forceUpdate();
    }
  };

  handleRowUpdated(e) {
    //merge updated row with current row and rerender by setting state
    const row = this.rowGetter(e.rowIdx);
    Object.assign(row._row || row, e.updated);
  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange(scheme) {

    const {props, state} = this;
    const _columns = scheme.rx_columns({
      mode: 'ts',
      fields: state._meta.fields,
      _obj: props._obj
    });

    this.setState({scheme, _columns});
  };

  onRowsSelected = (rows) => {
    const {rowSelection} = this.props;
    this.setState({
      selectedIds: this.state.selectedIds.concat(
        rows.map(r => {
          if(rowSelection.selectBy.keys.markKey) {
            r.row[rowSelection.selectBy.keys.markKey] = true;
          }
          return r.row[rowSelection.selectBy.keys.rowKey];
        }))
    });
  };

  onRowsDeselected = (rows) => {
    const {rowSelection} = this.props;
    let rowIds = rows.map(r => {
      if(rowSelection.selectBy.keys.markKey) {
        r.row[rowSelection.selectBy.keys.markKey] = false;
      }
      return r.row[rowSelection.selectBy.keys.rowKey];
    });
    this.setState({
      selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1)
    });
  };

  render() {
    const {props, state, rowGetter, onRowsSelected, onRowsDeselected, handleAdd, handleRemove, handleUp, handleDown, handleRowUpdated} = this;
    const {_meta, _tabular, _columns, scheme, selectedIds, Toolbar} = state;
    const {_obj, rowSelection, denyAddDel, denyReorder, minHeight, handleCustom, classes} = props;

    if(!_columns || !_columns.length) {
      if(!scheme) {
        return <LoadingMessage text="Чтение настроек компоновки..."/>;
      }

      return <LoadingMessage text="Ошибка настроек компоновки..."/>;
    }

    if(rowSelection) {
      rowSelection.onRowsSelected = onRowsSelected;
      rowSelection.onRowsDeselected = onRowsDeselected;
      rowSelection.selectBy.keys.values = selectedIds;
    }

    return (
        <AutoSizer>
          {({width, height}) => {

            return <div>
              <Toolbar
                handleAdd={handleAdd}
                handleRemove={handleRemove}
                handleUp={handleUp}
                handleDown={handleDown}
                handleCustom={handleCustom}
                denyAddDel={denyAddDel}
                denyReorder={denyReorder}
                scheme={scheme}/>

              <ReactDataGrid
                minWidth={width}
                minHeight={height < minHeight ? minHeight : height}
                rowHeight={33}

                ref={(el) => this._grid = el}
                columns={_columns}
                enableCellSelect={true}
                rowGetter={rowGetter}
                rowsCount={_tabular.count()}
                onRowUpdated={handleRowUpdated}
                rowSelection={rowSelection}/>
            </div>
          }
          }
        </AutoSizer>

    );
  }
}

// export default withStyles({
//   layout: {
//
//   },
//   toolbar: {
//
//   },
//   content: {
//
//   },
// })(TabularSection);
