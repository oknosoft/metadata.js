/** @flow */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {InfiniteLoader, AutoSizer, MultiGrid} from 'react-virtualized';
import LoadingMessage from '../DumbLoader/LoadingMessage';
import Toolbar from './DataListToolbar';
import cn from 'classnames';

import Confirm from '../Confirm';

import withStyles from './styles';

import control_by_type from 'metadata-abstract-ui/src/ui';


class DataList extends Component {

  static LIMIT = 40;
  static OVERSCAN_ROW_COUNT = 2;
  static OVERSCAN_COLUMN_COUNT = 2;
  static COLUMN_HEIGHT = 32;
  static COLUMN_DEFAULT_WIDTH = 220;

  constructor(props, context) {
    super(props, context);

    const {class_name} = props._mgr;

    this.state = {
      rowsLoaded: 0,
      selectedRowIndex: 0,
      _meta: props._meta || props._mgr.metadata(),

      // готовим фильтры для запроса couchdb
      select: props.select || {
        _view: 'doc/by_date',
        _raw: true,
        _top: 30,
        _skip: 0,
        _key: {
          startkey: [props.params && props.params.options || class_name, 2000],
          endkey: [props.params && props.params.options || class_name, 2020]
        }
      }
    };

    /** Set of grid rows. */
    this._list = new Map();
    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);

    this._isMounted = false;
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
    if(handlers.handleAdd) {
      handlers.handleAdd(_mgr);
    }
  };

  // обработчик редактирования элемента списка
  handleEdit = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    if(!row || $p.utils.is_empty_guid(row.ref)){
      handlers.handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, text: 'Укажите строку для редактирования', title: this.state._meta.synonym}
      })
    }
    else if(handlers.handleEdit) {
      handlers.handleEdit({ref: row.ref, _mgr});
    }
  };

  // обработчик удаления элемента списка
  handleRemove = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;

    if(!row || $p.utils.is_empty_guid(row.ref)){
      handlers.handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, text: 'Укажите строку для удаления', title: this.state._meta.synonym}
      })
    }
    else if(handlers.handleMarkDeleted) {
      this._handleRemove = function () {
        handlers.handleMarkDeleted(row.ref, _mgr);
      }
      this.setState({confirm_text: 'Удалить объект?'});
    }
  };

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {
    const {state, props} = this;
    const {_mgr, params} = props;

    scheme.set_default().fix_select(state.select, params && params.options || _mgr.class_name);
    this._list.clear();

    // Create header row.
    const columns = scheme.columns();
    // Set first row as header.
    this._list.set(0, columns.map(column => (column.synonym)));


    if(this._isMounted){
      this.setState({scheme, columns, rowsLoaded: 1});
    }
    else{
      Object.assign(state, {scheme, columns, rowsLoaded: 1});
    }

    this._loadMoreRows({
      startIndex: 0,
      stopIndex: DataList.LIMIT
    });
  };

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    if(row && handlers.handlePrint) {
      handlers.handlePrint(row, _mgr);
    }
  };

  // обработчик вложений теущей строки
  handleAttachment = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    if(row && handlers.handleAttachment) {
      handleAttachment(row, _mgr);
    }
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {
      state,
      props,
      handleSelect,
      handleAdd,
      handleEdit,
      handleRemove,
      handlePrint,
      handleAttachment,
      handleSchemeChange,
      _isRowLoaded,
      _loadMoreRows,
      _cellRenderer
    } = this;

    const {columns, rowsLoaded, scheme, colResize, confirm_text, _meta} = state;

    const {selection_mode, denyAddDel, show_search, show_variants, width, height, classes} = props;

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
      handleSchemeChange
    };

    const styleTopRightGrid = {
      backgroundColor: '#eeeeee',
      borderBottom: '1px solid #e0e0e0',
      cursor: colResize ? 'col-resize' : 'default',
    };

    return (
      <div style={{height}}>

        {
          confirm_text && <Confirm
            title={_meta.synonym}
            text={confirm_text}
            handleOk={this._handleRemove}
            handleCancel={() => this.setState({confirm_text: ''})}
            open
          />
        }

        <Toolbar {...toolbar_props} />

        <InfiniteLoader
          isRowLoaded={_isRowLoaded}
          loadMoreRows={_loadMoreRows}
          rowCount={this.state.rowsLoaded + DataList.LIMIT}
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
                width={width}
                height={height - 52}
                rowCount={this.state.rowsLoaded}
                columnCount={this.state.columns.length}
                fixedColumnCount={0}
                fixedRowCount={1}
                noContentRenderer={this._noContentRendered}
                cellRenderer={this._cellRenderer}
                overscanColumnCount={DataList.OVERSCAN_COLUMN_COUNT}
                overscanRowCount={DataList.OVERSCAN_ROW_COUNT}
                columnWidth={this._getColumnWidth}
                rowHeight={DataList.COLUMN_HEIGHT}
                onSectionRendered={onSectionRendered}
                styleTopRightGrid={styleTopRightGrid}/>
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

  _loadMoreRows = ({startIndex, stopIndex}) => {
    const {select, scheme, rowsLoaded} = this.state;
    const {_mgr, params} = this.props;
    const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1);

    Object.assign(select, {
      _top: increment,
      _skip: startIndex,
      _view: 'doc/by_date',
      _raw: true
    });

    scheme.fix_select(select, params && params.options || _mgr.class_name);
    // выполняем запрос
    return _mgr.find_rows_remote(select).then((data) => {

      let reallyLoadedRows = 0;
      // обновляем массив результата
      for (var i = 0; i < data.length; i++) {
        // Append one because first row is header.
        if(this._list.has(1 + i + startIndex) === false) {
          reallyLoadedRows++;
          this._list.set(1 + i + startIndex, data[i]);
        }
      }

      // Обновить количество записей.
      this._isMounted && reallyLoadedRows && this.setState({rowsLoaded: this.state.rowsLoaded + reallyLoadedRows});

    });
  };
}

DataList.propTypes = {

  // данные
  _mgr: PropTypes.object.isRequired,    // Менеджер данных
  _meta: PropTypes.object,              // Описание метаданных. Если не указано, используем метаданные менеджера

  // настройки компоновки
  select: PropTypes.object,             // todo: переместить в scheme // Параметры запроса к couchdb. Если не указано - генерируем по метаданным

  // настройки внешнего вида и поведения
  selection_mode: PropTypes.bool,       // Режим выбора из списка. Если истина - дополнительно рисуем кнопку выбора
  read_only: PropTypes.object,          // Элемент только для чтения
  denyAddDel: PropTypes.bool,           // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  show_search: PropTypes.bool,          // Показывать поле поиска
  show_variants: PropTypes.bool,        // Показывать список вариантов настройки динсписка
  modal: PropTypes.bool,                // Показывать список в модальном диалоге
  Toolbar: PropTypes.func,              // Индивидуальная панель инструментов. Если не указана, рисуем типовую

  // Redux actions
  handlers: PropTypes.object.isRequired, // обработчики редактирования объекта

};

export default withStyles(DataList);
