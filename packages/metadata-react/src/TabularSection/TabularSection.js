import React from 'react';
import PropTypes from 'prop-types';

import MComponent from '../common/MComponent';
import TabularSectionToolbar from './TabularSectionToolbar';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import LoadingMessage from '../DumbLoader/LoadingMessage';

import ReactDataGrid from 'react-data-grid';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';

const cmpType = PropTypes.oneOfType([PropTypes.object, PropTypes.array]);

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

    if(init){
      this.state = state;
    }
    else{
      this.setState(state);
    }

    if(props.scheme) {
      this.handleSchemeChange(props.scheme)
    }
    else {
      $p.cat.scheme_settings.get_scheme(_obj._manager.class_name + '.' + _tabular).then(this.handleSchemeChange);
    }
  }

  getRows() {
    const {props: {filter}, state: {scheme, _tabular}} = this;
    if(typeof filter === 'function') {
      return filter(_tabular);
    }
    return scheme ? scheme.filter(_tabular) : [];
  }

  rowsCount() {
    return this.getRows().length;
  }

  rowGetter = (i) => {
    return this.getRows()[i];
  };

  handleRemove = () => {
    const {_tabular, selected} = this.state;
    if(selected && selected.hasOwnProperty('rowIdx')) {
      _tabular.del(this.rowGetter(selected.rowIdx));
      this.forceUpdate();
    }
  };

  handleClear = () => {
    const {_tabular} = this.state;
    if(_tabular) {
      const rows = this.getRows();
      _tabular.clear({row: {in: rows.map((v) => v.row)}});
      this.forceUpdate();
    }
  };

  handleAdd = () => {
    const {_tabular} = this.state;
    if(_tabular) {
      _tabular.add();
      this.forceUpdate();
    }
  };

  handleUp = () => {
    const {_tabular, selected} = this.state;
    if(selected && selected.hasOwnProperty('rowIdx') && selected.rowIdx > 0) {
      const rows = this.getRows();
      if(row.row > 0) {
        _tabular.swap(rows[selected.rowIdx], rows[selected.rowIdx - 1]);
        selected.rowIdx = selected.rowIdx - 1;
        this.setState({selected});
      }
    }
  };

  handleDown = () => {
    const {_tabular, selected} = this.state;
    if(selected && selected.hasOwnProperty('rowIdx')) {
      const rows = this.getRows();
      if(selected.rowIdx < rows.length - 2) {
        _tabular.swap(rows[selected.rowIdx], rows[selected.rowIdx + 1]);
        selected.rowIdx = selected.rowIdx + 1;
        this.setState({selected});
      }
    }
  };

  handleRowsUpdated = ({ fromRow, toRow, updated }) => {
    //merge updated row with current row and rerender by setting state
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
    Promise.resolve().then(() => this._grid && this._grid.forceUpdate());
  }

  handleSettingsOpen = () => {
    this.setState({settings_open: true});
  };

  handleSettingsClose = () => {
    this.setState({settings_open: false});
  };

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {

    const {props: {_obj, read_only, columnsChange}, state} = this;
    const _columns = scheme.rx_columns({
      mode: 'ts',
      fields: state._meta.fields,
      _obj,
      read_only,
    });

    columnsChange && columnsChange({scheme, columns: _columns});

    if(this._mounted) {
      this.setState({scheme, _columns});
    }
    else {
      Object.assign(state, {scheme, _columns});
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

  render() {
    const {props, state, rowGetter, onRowsSelected, onRowsDeselected, handleRowsUpdated} = this;
    const {_tabular, _columns, scheme, selectedIds, settings_open} = state;
    const {_obj, rowSelection, minHeight, hideToolbar, denyAddDel, denyReorder, btns, end_btns, menu_items} = props;
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
                ref={(el) => this._grid = el}
                columns={_columns}
                enableCellSelect={true}
                rowGetter={rowGetter}
                rowsCount={this.rowsCount()}
                rowSelection={rowSelection}
                onCellDeSelected={this.onCellDeSelected}
                onCellSelected={this.onCellSelected}
                onGridRowsUpdated={handleRowsUpdated}
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

  read_only: PropTypes.bool,            // Элемент только для чтения
  hideToolbar: PropTypes.bool,          // Указывает не выводить toolbar
  denyAddDel: PropTypes.bool,           // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  denyReorder: PropTypes.bool,          // Запрет изменения порядка строк
  minHeight: PropTypes.number,
  btns: cmpType,                        // дополнительные кнопки
  menu_items: cmpType,                  // дополнительные пункты меню

  handleValueChange: PropTypes.func,    // Обработчик изменения значения в ячейке
  handleRowChange: PropTypes.func,      // При окончании редактирования строки
  handleCustom: PropTypes.func,         // Внешний дополнительный подключаемый обработчик

  rowSelection: PropTypes.object,       // Настройка пометок строк
  selectedIds: PropTypes.array,

  onCellSelected: PropTypes.func,
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

