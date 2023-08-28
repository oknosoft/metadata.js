import React from 'react';
import PropTypes from 'prop-types';

import MComponent from '../common/MComponent';
import TabularSectionToolbar from './TabularSectionToolbar';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import LoadingMessage from '../DumbLoader/LoadingMessage';

import ReactDataGrid from 'react-data-grid';
import AutoSizer from 'react-virtualized-auto-sizer';

class TabularSection extends MComponent {

  constructor(props, context) {
    super(props, context);
    this.handleObjChange(props, true);
  }

  componentDidMount() {
    super.componentDidMount();
    this.portalTarget = this.context.dnr ? this.context.dnr.portalTarget() : undefined;
  }

  shouldComponentUpdate(props, {_tabular}){
    if(_tabular._owner != props._obj){
      this.handleObjChange(props);
      return false;
    }
    return true;
  }

  handleObjChange(props, init) {

    const {_obj, _tabular} = props;

    const state = {
      _meta: props._meta || _obj._metadata(_tabular),
      _tabular: _obj[_tabular],
      _columns: [],
      selectedIds: props.rowSelection ? props.rowSelection.selectBy.keys.values : [],
      settings_open: false,
    };

    this.cache_actual = false;

    if(init){
      this.state = state;
      this._rows = [];
    }
    else{
      this.setState(state);
      this._rows.length = 0;
    }

    if(props.scheme) {
      this.handleSchemeChange(props.scheme)
    }
    else {
      $p.cat.scheme_settings.get_scheme(_obj._manager.class_name + '.' + _tabular).then(this.handleSchemeChange);
    }
  }

  getRows() {
    const {props: {filter, disable_cache}, state: {scheme, _tabular}, cache_actual} = this;
    if(!cache_actual || disable_cache) {
      this._rows = this.searchFilter(
        typeof filter === 'function' ? filter(_tabular) : (scheme ? scheme.filter(_tabular) : [])
      );
      this.cache_actual = true;
    }
    return this._rows;
  }

  searchFilter(rows) {
    const {scheme, _columns} = this.state;
    if(!scheme || !scheme._search) {
      return rows;
    }
    const res = [];
    const selection = {
      _search: {
        fields: _columns.map((column) => column.key),
        value: scheme._search.trim().replace(/\s\s/g, ' ').split(' ').filter(v => v),
      }
    };
    const {_selection} = $p.utils;
    for(const row of rows) {
      if(_selection(row, selection)) {
        res.push(row);
      }
    }
    return res;
  }

  rowsCount() {
    return this.getRows().length;
  }

  rowGetter = (i) => {
    return this.getRows()[i];
  };

  handleFilterChange = () => {
    this.cache_actual = false;
    this.forceUpdate();
  };

  handleRemove = () => {
    const {state: {_tabular, selected}, props: {handleRemove}} = this;
    let row;
    if(selected && selected.hasOwnProperty('rowIdx')) {
      if(handleRemove) {
        handleRemove(_tabular);
      }
      row = this.rowGetter(selected.rowIdx);
      _tabular.del(row);
      this.handleFilterChange();
    }
    return row;
  };

  handleClear = () => {
    const {_tabular} = this.state;
    if(_tabular) {
      const rows = this.getRows();
      _tabular.clear({row: {in: rows.map((v) => v.row)}});
      this.handleFilterChange();
    }
  };

  handleAdd = () => {
    const {state: {_tabular}, props: {handleAdd}} = this;
    if(handleAdd) {
      handleAdd(_tabular);
    }
    else if(_tabular) {
      _tabular.add();
      this.handleFilterChange();
    }
  };

  handleUp = () => {
    const {_tabular, selected} = this.state;
    if(selected && selected.hasOwnProperty('rowIdx') && selected.rowIdx > 0) {
      const rows = this.getRows();
      _tabular.swap(rows[selected.rowIdx], rows[selected.rowIdx - 1]);
      this.cache_actual = false;
      this._grid.selectCell({rowIdx: selected.rowIdx - 1, idx: selected.idx}, false);
    }
  };

  handleDown = () => {
    const {_tabular, selected} = this.state;
    if(selected && selected.hasOwnProperty('rowIdx')) {
      const rows = this.getRows();
      if(selected.rowIdx <= rows.length - 2) {
        _tabular.swap(rows[selected.rowIdx], rows[selected.rowIdx + 1]);
        this.cache_actual = false;
        this._grid.selectCell({rowIdx: selected.rowIdx + 1, idx: selected.idx}, false);
      }
    }
  };

  handleRowsUpdated = ({ fromRow, toRow, updated }) => {
    //merge updated row with current row and rerender by setting state
    if(fromRow !== toRow) {
      return;
    }
    for (let i = fromRow; i <= toRow; i++) {
      const row = this.rowGetter(i);
      if(row){
        if(this.props.onRowUpdated){
          if(this.props.onRowUpdated(updated, row) === false){
            return;
          }
        }
        const _row = row._row || row;
        Object.assign(_row, updated, {_modified: true});
      }
    }
    // const selectedIds = this.state.selectedIds.slice();
    // this.setState({selectedIds});
    this.handleFilterChange();

  }

  handleSettingsOpen = () => {
    this.setState({settings_open: true});
  };

  handleSettingsClose = () => {
    this.setState({settings_open: false});
  };

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {

    const {props: {_obj, read_only, columnsChange, denyReorder, denySort}, state} = this;
    const _columns = scheme.rx_columns({mode: 'tabular', fields: state._meta.fields, _obj, read_only});
    if(denyReorder || denySort) {
      for(const column of _columns) {
        column.sortable = false;
      }
    }

    columnsChange && columnsChange({scheme, columns: _columns});

    if(this._mounted) {
      this.setState({scheme, _columns});
    }
    else {
      Object.assign(state, {scheme, _columns});
    }
  };

  handleSort = (sortColumn, sortDirection) => {
    const {_tabular, scheme} = this.state;
    scheme.first_sorting(sortColumn, sortDirection);
    if(sortDirection && sortDirection !== 'NONE') {
      _tabular.sort(`${sortColumn} ${sortDirection.toLowerCase()}`);
      this.cache_actual = false;
      this.setState({selected: {rowIdx: 0}});
    }
  };

  onRowsSelected = (rows) => {
    const {props, state} = this;
    const {keys} = props.rowSelection.selectBy;
    this.setState({
      selectedIds: state.selectedIds.concat(
        rows.map(r => {
          if(keys.markKey) {
            r.row[keys.markKey] = true;
          }
          return r.row[keys.rowKey];
        }))
    });
  };

  onRowsDeselected = (rows) => {
    const {keys} = this.props.rowSelection.selectBy;
    let rowIds = rows.map(r => {
      if(keys.markKey) {
        r.row[keys.markKey] = false;
      }
      return r.row[keys.rowKey];
    });
    this.setState({
      selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1)
    });
  };

  onCellSelected = (selected) => {
    this.setState({selected});
    this.props.onCellSelected && this.props.onCellSelected(selected);
  };

  onCellDeSelected = (v) => {
    const {selected} = this.state;
    if(!v || selected.rowIdx !== v.rowIdx) {
      this.setState({selected: null});
    }
  };
  
  handleRef = (el) => {
    if(this._grid !== el) {
      this._grid = el;
      if(el && this.props.selectedRow) {
        const rows = this.getRows();
        const rowIdx = rows.indexOf(this.props.selectedRow);
        if(rowIdx >= 0) {
          el.selectCell({rowIdx, idx: 0});
        }
      }
    }
  }

  render() {
    const {props, state, rowGetter, onRowsSelected, onRowsDeselected} = this;
    const {_tabular, _columns, scheme, selectedIds, settings_open} = state;
    const {_obj, rowSelection, minHeight, hideToolbar, denyAddDel, denyReorder, rowRenderer, btns, end_btns, menu_items} = props;
    const Toolbar = props.Toolbar || TabularSectionToolbar;

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

            const show_grid = !settings_open || Math.max(minHeight, height) > 372;

            return [
              !hideToolbar && <Toolbar
                key="toolbar"
                width={width}
                _obj={_obj}
                _tabular={_tabular}
                _columns={_columns}
                scheme={scheme}
                settings_open={settings_open}
                owner={this}

                denyAddDel={denyAddDel}
                denyReorder={denyReorder}
                btns={btns}
                end_btns={end_btns}
                menu_items={menu_items}

                handleSettingsOpen={this.handleSettingsOpen}
                handleSettingsClose={this.handleSettingsClose}
                handleSchemeChange={this.handleSchemeChange}
                handleAdd={this.handleAdd}
                handleRemove={this.handleRemove}
                handleClear={this.handleClear}
                handleUp={this.handleUp}
                handleDown={this.handleDown}
                handleFilterChange={this.handleFilterChange}
                handleCustom={props.handleCustom}
              />,

              settings_open && <SchemeSettingsTabs
                key="schemesettings"
                height={show_grid ? 272 : Math.max(minHeight, height)}
                scheme={scheme}
                handleSchemeChange={this.handleSchemeChange}
              />,

              <ReactDataGrid
                key="grid"
                minWidth={width}
                minHeight={Math.max(minHeight, height) - (hideToolbar ? 2 : 52) - (settings_open ? 320 : 0)}
                rowHeight={33}
                ref={this.handleRef}
                columns={_columns}
                enableCellSelect={true}
                rowGetter={rowGetter}
                rowsCount={this.rowsCount()}
                rowSelection={rowSelection}
                rowRenderer={rowRenderer}
                onCellDeSelected={this.onCellDeSelected}
                onCellSelected={this.onCellSelected}
                onGridRowsUpdated={this.handleRowsUpdated}
                onRowDoubleClick={props.onRowDoubleClick}
                onGridSort={this.handleSort}
                editorPortalTarget={props.portalTarget || this.portalTarget}
                hideHeader={props.hideHeader}
              />

            ];
          }}
        </AutoSizer>
    );
  }
}

TabularSection.propTypes = {
  _obj: PropTypes.object.isRequired,
  _tabular: PropTypes.string.isRequired,
  _meta: PropTypes.object,
  scheme: PropTypes.object,             // Вариант настроек
  disable_cache: PropTypes.bool,        // Не кешировать отбор строк
  filter: PropTypes.func,               // Внешняя функция отбора строк (вместо фильтра по схеме)

  read_only: PropTypes.bool,            // Элемент только для чтения
  hideToolbar: PropTypes.bool,          // Указывает не выводить toolbar
  denyAddDel: PropTypes.bool,           // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  denyReorder: PropTypes.bool,          // Запрет изменения порядка строк
  denySort: PropTypes.bool,             // Запрет сортировки в заголовках колонок
  minHeight: PropTypes.number,
  btns: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]), // дополнительные кнопки
  menu_items: PropTypes.node,           // дополнительные пункты меню

  handleValueChange: PropTypes.func,    // Обработчик изменения значения в ячейке
  handleRowChange: PropTypes.func,      // При окончании редактирования строки
  handleCustom: PropTypes.func,         // Внешний дополнительный подключаемый обработчик

  rowSelection: PropTypes.object,       // Настройка пометок строк
  selectedIds: PropTypes.array,
  selectedRow: PropTypes.object,

  onCellSelected: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
  onRowUpdated: PropTypes.func,
  columnsChange: PropTypes.func,
};

TabularSection.defaultProps = {
  denyAddDel: false,
  read_only: false,
  minHeight: 220,
};

TabularSection.contextTypes = {
  dnr: PropTypes.object
};

export default TabularSection;

