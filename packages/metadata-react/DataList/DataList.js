/** @flow */
import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import {InfiniteLoader, AutoSizer, MultiGrid} from 'react-virtualized';
import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataListToolbar from './DataListToolbar';
import cn from 'classnames';

import Confirm from '../Confirm';

import withStyles from './styles';

import control_by_type from 'metadata-abstract-ui/src/ui';


class DataList extends MDNRComponent {

  static LIMIT = 40;
  static OVERSCAN_ROW_COUNT = 2;
  static OVERSCAN_COLUMN_COUNT = 2;
  static COLUMN_HEIGHT = 33;
  static COLUMN_DEFAULT_WIDTH = 220;

  static propTypes = {

    // данные
    _mgr: PropTypes.object.isRequired,    // Менеджер данных
    _acl: PropTypes.string,               // Права на чтение-изменение
    _meta: PropTypes.object,              // Описание метаданных. Если не указано, используем метаданные менеджера

    _owner: PropTypes.object,             // Поле - родитель. У него должны быть _obj, _fld и _meta
                                          // а внутри _meta могут быть choice_params и choice_links

    // настройки внешнего вида и поведения
    selection_mode: PropTypes.bool,       // Режим выбора из списка. Если истина - дополнительно рисуем кнопку выбора
    read_only: PropTypes.object,          // Элемент только для чтения
    denyAddDel: PropTypes.bool,           // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    show_search: PropTypes.bool,          // Показывать поле поиска
    show_variants: PropTypes.bool,        // Показывать список вариантов настройки динсписка
    modal: PropTypes.bool,                // Показывать список в модальном диалоге

    // Redux actions
    handlers: PropTypes.object.isRequired, // обработчики редактирования объекта

  }

  constructor(props, context) {
    super(props, context);

    this.state = {selectedRowIndex: 0};

    /** Set of grid rows. */
    this._list = new Map();

    this.handleManagerChange(props);
  }

  shouldComponentUpdate({_mgr, _meta}) {
    if (this.props._mgr != _mgr) {
      this.handleManagerChange({_mgr, _meta});
      return false;
    }
    return true;
  }

  // при изменении менеджера данных
  handleManagerChange({_mgr, _meta}) {

    const {class_name, cachable, alatable} = _mgr;

    this._meta = _meta || _mgr.metadata();

    const state = {rowsLoaded: cachable === 'ram' ? alatable.length : 0};

    if(this._mounted) {
      this.setState(state);
    }
    else {
      Object.assign(this.state, state);
    }

    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);

  }

  // обработчик выбора значения в списке
  handleSelect = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    if(row && handlers.handleSelect) {
      handlers.handleSelect(row, _mgr);
    }
  };

  // обработчик добавления элемента списка
  handleAdd = () => {
    const {handlers, _mgr} = this.props;
    handlers.handleAdd && handlers.handleAdd(_mgr);
  };

  // обработчик редактирования элемента списка
  handleEdit = () => {
    const {_list, _meta, state, props} = this;
    const {handlers, _mgr} = props;
    const row = _list.get(state.selectedRowIndex);
    if(!row || $p.utils.is_empty_guid(row.ref)) {
      handlers.handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, text: 'Укажите строку для редактирования', title: _meta.synonym}
      });
    }
    else if(handlers.handleEdit) {
      handlers.handleEdit({ref: row.ref, _mgr});
    }
  };

  // обработчик удаления элемента списка
  handleRemove = () => {
    const {_list, _meta, state, props} = this;
    const {handlers, _mgr} = props;
    const row = _list.get(state.selectedRowIndex);

    if(!row || $p.utils.is_empty_guid(row.ref)) {
      handlers.handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, text: 'Укажите строку для удаления', title: _meta.synonym}
      });
    }
    else if(handlers.handleMarkDeleted) {
      this._handleRemove = function () {
        handlers.handleMarkDeleted(row.ref, _mgr);
      };
      this.setState({confirm_text: 'Удалить объект?'});
    }
  };

  // при изменении настроек или варианта компоновки
  handleSchemeChange = (scheme) => {
    scheme.set_default();
    // пересчитываем и перерисовываем динсписок
    this.handleFilterChange(scheme, scheme.columns());
  };

  // при изменении параметров компоновки - схему не меняем, но выполняем пересчет
  handleFilterChange = (scheme, columns) => {

    const {state, _list, _mounted} = this;

    if(!(scheme instanceof $p.CatScheme_settings)){
      scheme = state.scheme;
    }

    if(!columns){
      columns = state.columns;
    }

    // Set first row as header.
    _list.clear();
    _list.set(0, columns.map(column => (column.synonym)));

    if(_mounted) {
      this.setState({scheme, columns, rowsLoaded: 1});
    }
    else {
      Object.assign(state, {scheme, columns, rowsLoaded: 1});
    }

    this._loadMoreRows({
      startIndex: 0,
      stopIndex: DataList.LIMIT
    });
  }

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    row && handlers.handlePrint && handlers.handlePrint(row, _mgr);
  };

  // обработчик вложений теущей строки
  handleAttachment = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    row && handlers.handleAttachment && handleAttachment(row, _mgr);
  };

  get sizes() {
    const {dnr} = this.context;
    let {width, height} = this.props;
    if(!height) {
      height = dnr && parseInt(dnr.frameRect.height);
    }
    if(!height || height < 320) {
      height = 320;
    }
    if(!width) {
      width = dnr && parseInt(dnr.frameRect.width);
    }
    if(!width || width < 480) {
      width = 480;
    }
    return {width, height};
  }

  render() {
    const {
      state,
      props,
      _meta,
      sizes,
      handleSelect,
      handleAdd,
      handleEdit,
      handleRemove,
      handlePrint,
      handleAttachment,
      handleSchemeChange,
      handleFilterChange,
      _isRowLoaded,
      _loadMoreRows,
      _cellRenderer,
    } = this;

    const {columns, rowsLoaded, scheme, colResize, confirm_text} = state;

    const styleTopRightGrid = {
      cursor: colResize ? 'col-resize' : 'default',
    }

    let {selection_mode, denyAddDel, show_search, show_variants, classes} = props;

    if(!scheme) {
      return <LoadingMessage title="Чтение настроек компоновки..."/>;
    }
    else if(!columns || !columns.length) {
      return <LoadingMessage title="Ошибка настроек компоновки..."/>;
    }

    const toolbar_props = {
      scheme,
      selection_mode,
      denyAddDel,
      show_search,
      show_variants,
      handleSelect,
      handleAdd,
      handleEdit,
      handleRemove,
      handlePrint,
      handleAttachment,
      handleSchemeChange,
      handleFilterChange,
    };


    return (
      <div style={{height: sizes.height}}>

        {
          confirm_text && <Confirm
            title={_meta.synonym}
            text={confirm_text}
            handleOk={this._handleRemove}
            handleCancel={() => this.setState({confirm_text: ''})}
            open
          />
        }

        <DataListToolbar {...toolbar_props} />

        <InfiniteLoader
          isRowLoaded={_isRowLoaded}
          loadMoreRows={_loadMoreRows}
          rowCount={rowsLoaded + DataList.LIMIT}
          minimumBatchSize={DataList.LIMIT}>

          {({onRowsRendered, registerChild}) => {
            const onSectionRendered = ({rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex}) => {
              onRowsRendered({
                overscanStartIndex: rowOverscanStartIndex,
                overscanStopIndex: rowOverscanStopIndex,
                startIndex: rowStartIndex * this.state.columns.length + columnStartIndex,
                stopIndex: rowStopIndex * this.state.columns.length + columnStopIndex
              });
            };

            return (
              <MultiGrid
                ref={registerChild}
                tabIndex={0}
                width={sizes.width}
                height={sizes.height - 52}
                rowCount={rowsLoaded}
                columnCount={columns.length}
                fixedRowCount={1}
                noContentRenderer={this._noContentRendered}
                cellRenderer={this._cellRenderer}
                overscanColumnCount={DataList.OVERSCAN_COLUMN_COUNT}
                overscanRowCount={DataList.OVERSCAN_ROW_COUNT}
                columnWidth={this._getColumnWidth}
                rowHeight={DataList.COLUMN_HEIGHT}
                onSectionRendered={onSectionRendered}
                styleTopRightGrid={styleTopRightGrid}
                classNameTopRightGrid={classes.topRightGrid}/>
            );
          }}
        </InfiniteLoader>
      </div>
    );
  }

  _getColumnWidth = ({index}) => {
    // todo: Take remaining space if width of column equal '*'
    if(!isNaN(parseInt(this.state.columns[index].width))) {
      return DataList.COLUMN_DEFAULT_WIDTH;
    }
    else {
      return parseInt(this.state.columns[index].width);
    }
  };

  _noContentRendered = () => {
    return <LoadingMessage/>;
  };

  _cellRenderer = ({columnIndex, rowIndex, isScrolling, isVisible, key, parent, style}) => {
    const {state, props, handleEdit, handleSelect} = this;
    const {hoveredColumnIndex, hoveredRowIndex, selectedRowIndex} = state;
    const {cell, headerCell, hoveredItem, selectedItem} = props.classes;

    // оформление ячейки
    const classNames = cn(this._getRowClassName(rowIndex), cell, {
      [headerCell]: rowIndex === 0, // выравнивание текста по центру
      [hoveredItem]: rowIndex != 0 && rowIndex == hoveredRowIndex && rowIndex != selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
      [selectedItem]: rowIndex != 0 && rowIndex == selectedRowIndex
    });

    // данные строки
    const row = this._list.get(rowIndex);

    // текст ячейки (header - data cell - empty cell)
    const content = rowIndex === 0 ? row[columnIndex] : row && this._formatter(row, columnIndex);

    const onMouseOver = () => {
      this.setState({
        hoveredColumnIndex: columnIndex,
        hoveredRowIndex: rowIndex
      });
    };
    const onMouseMove = ({target, clientX}) => {
      const br = target.getBoundingClientRect();
      const colResize = (Math.abs(br.left - clientX) < 6) || (Math.abs(br.right - clientX) < 6);
      colResize != this.state.colResize && this.setState({colResize});
    };

    const onClick = () => this.setState({selectedRowIndex: rowIndex});

    return (
      <div
        className={classNames}
        key={`cell-${rowIndex}-${columnIndex}`}
        style={style}
        onMouseOver={onMouseOver}
        onMouseMove={rowIndex == 0 && onMouseMove}
        onClick={onClick}
        onDoubleClick={props.selection_mode ? handleSelect : handleEdit}
        title={hoveredColumnIndex == columnIndex && hoveredRowIndex == rowIndex ? content : ''}>
        {content}
      </div>
    );
  };

  _formatter(rowData, columnIndex) {
    const {columns} = this.state;
    const column = columns[columnIndex];
    const v = rowData[column.id];

    switch (control_by_type(column.type, v)) {
    case 'ocombo':
      return this.props._mgr.value_mgr(rowData, column.id, column.type, false, v).get(v).presentation;

    case 'dhxCalendar':
      return $p.utils.moment(v).format($p.utils.moment._masks.date);

    default:
      return v ? v.toString() : '';
    }
  }

  _getRowClassName(row) {
    const {classes} = this.props;
    return row % 2 === 0 ? classes.evenRow : classes.oddRow;
  }

  _isRowLoaded = ({index}) => {
    return this._list.has(index);
  };

  _updateList = (data, startIndex) => {
    const {_list} = this;

    let reallyLoadedRows = 0;

    // обновляем массив результата
    for (let i = 0; i < data.length; i++) {
      // Append one because first row is header.
      if(_list.has(1 + i + startIndex) === false) {
        reallyLoadedRows++;
        _list.set(1 + i + startIndex, data[i]);
      }
    }
    // Обновить количество записей.
    this._mounted && reallyLoadedRows && this.setState({rowsLoaded: this.state.rowsLoaded + reallyLoadedRows});
  }

  _loadMoreRows = ({startIndex, stopIndex}) => {
    const {_mgr, _owner} = this.props;
    const {scheme, columns, rowsLoaded} = this.state;

    const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1);

    // в зависимости от типа кеширования...
    if(_mgr.cachable === 'ram' || _mgr.cachable === 'doc_ram'){
      // фильтруем в озу
      const selector = _mgr.get_search_selector({
        _obj: _owner ? _owner._obj : null,
        _meta: _owner ? _owner._meta : {},
        search: scheme._search,
        top: increment,
        skip: startIndex ? startIndex - 1 : 0,
      });
      return Promise.resolve(this._updateList(_mgr.find_rows(selector), startIndex))
    }
    else{
      // выполняем запрос
      return _mgr.find_rows_remote(scheme.mango_selector({
        columns,
        skip: startIndex ? startIndex - 1 : 0,
        limit: increment,
      })).then((data) => this._updateList(data, startIndex));
    }

  };
}


export default withStyles(DataList);
