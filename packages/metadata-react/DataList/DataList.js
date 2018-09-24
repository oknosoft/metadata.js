/** @flow */
import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import MultiGrid from 'react-virtualized/dist/es/MultiGrid';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import classnames from 'classnames';
import Helmet from 'react-helmet';
import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataListToolbar from './DataListToolbar';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import Confirm from '../App/Confirm';
import withStyles from './styles';
import {withIface} from 'metadata-redux';
import control_by_type from 'metadata-abstract-ui/src/ui';
import StarRate from '@material-ui/icons/StarRate';

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

    _owner: PropTypes.object,             // Поле - владелец. У него должны быть _obj, _fld и _meta
                                          // а внутри _meta могут быть choice_params и choice_links

    // настройки внешнего вида и поведения
    selectionMode: PropTypes.bool,       // Режим выбора из списка. Если истина - дополнительно рисуем кнопку выбора
    read_only: PropTypes.object,          // Элемент только для чтения
    denyAddDel: PropTypes.bool,           // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    show_search: PropTypes.bool,          // Показывать поле поиска
    show_variants: PropTypes.bool,        // Показывать список вариантов настройки динсписка
    modal: PropTypes.bool,                // Показывать список в модальном диалоге

    // Redux actions
    handlers: PropTypes.object.isRequired, // обработчики редактирования объекта

  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedRowIndex: 0,
      settings_open: false,
    };

    /** Set of grid rows. */
    this._list = new Map();

    this.handleManagerChange(props);
  }

  // при изменении менеджера данных
  handleManagerChange({_mgr, _meta}) {

    const {class_name, cachable, alatable} = _mgr;

    this._meta = _meta || _mgr.metadata();

    const state = {rowsLoaded: /ram$/.test(cachable) ? alatable.length : 0};

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
    row && handlers.handleSelect && handlers.handleSelect(row, _mgr);
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

    if(!(scheme instanceof $p.CatScheme_settings)) {
      scheme = state.scheme;
    }

    if(!columns) {
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
  };

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    row && handlers.handlePrint && handlers.handlePrint(row, _mgr);
  };

  // обработчик вложений теущей строки
  handleAttachments = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const {handlers, _mgr} = this.props;
    row && handlers.handleAttachments && handlers.handleAttachments(row, _mgr);
  };

  handleSettingsOpen = () => {
    this.setState({settings_open: true});
  };

  handleSettingsClose = () => {
    this.setState({settings_open: false});
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

  get ltitle() {
    const {_mgr} = this.props;
    return `${_mgr.metadata().list_presentation || _mgr.metadata().synonym} (список)`;
  }

  render() {
    const {state, props, context, _meta, sizes, _isRowLoaded, _loadMoreRows, _cellRenderer} = this;
    const {columns, rowsLoaded, scheme, colResize, confirm_text, settings_open} = state;
    const {RepParams} = props._mgr;

    const styleTopRightGrid = {
      cursor: colResize ? 'col-resize' : 'default',
    };

    let {selectionMode, denyAddDel, show_search, show_variants, classes, title} = props;

    if(!scheme) {
      return <LoadingMessage text="Чтение настроек компоновки..."/>;
    }
    else if(!columns || !columns.length) {
      return <LoadingMessage text="Ошибка настроек компоновки..."/>;
    }

    const show_grid = !settings_open || sizes.height > 572;

    const toolbar_props = {
      key: 'toolbar',
      scheme,
      selectionMode,
      denyAddDel,
      show_search,
      show_variants,
      settings_open,
      handleSelect: this.handleSelect,
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleRemove: this.handleRemove,
      handlePrint: this.handlePrint,
      handleAttachments: this.handleAttachments,
      handleSettingsOpen: this.handleSettingsOpen,
      handleSettingsClose: this.handleSettingsClose,
      handleSchemeChange: this.handleSchemeChange,
      handleFilterChange: this.handleFilterChange,
    };


    return [

      !context.dnr && <Helmet key="helmet" title={title}>
        <meta name="description" content="Форма списка" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content="Форма списка" />
      </Helmet>,

      // диалог предупреждений при удалении
      confirm_text && <Confirm
        key="confirm"
        title={_meta.synonym}
        text={confirm_text}
        handleOk={this._handleRemove}
        handleCancel={() => this.setState({confirm_text: ''})}
        open
      />,

      // панель инструментов табчасти
      <DataListToolbar {...toolbar_props} />,

      // панель настроек компоновки
      settings_open && <AutoSizer key="tabs" disableHeight>
        {({width}) => (
          <SchemeSettingsTabs
            height={show_grid ? 272 : (sizes.height || 500) - 104}
            width={width}
            scheme={scheme}
            tabParams={RepParams && <RepParams scheme={scheme}/>}
            handleSchemeChange={this.handleSchemeChange}
          />
        )}
      </AutoSizer>,

      // собственно, InfiniteLoader, внутри которого MultiGrid
      show_grid && <AutoSizer key="infinite" disableHeight>
        {({width}) => (
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
                  width={width}
                  height={sizes.height - 52 - (settings_open ? 320 : 0)}
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
        )}
      </AutoSizer>
    ];
  }

  _getColumnWidth = ({index}) => {
    // todo: Take remaining space if width of column equal '*'
    const {columns} = this.state;
    if(isNaN(parseInt(columns[index].width, 10))) {
      return DataList.COLUMN_DEFAULT_WIDTH;
    }
    else {
      return parseInt(columns[index].width, 10);
    }
  };

  _noContentRendered() {
    return <LoadingMessage/>;
  };

  _cellRenderer = ({columnIndex, rowIndex, isScrolling, isVisible, key, parent, style}) => {
    const {state, props, handleEdit, handleSelect} = this;
    const {hoveredColumnIndex, hoveredRowIndex, selectedRowIndex, columns} = state;
    const {cell, headerCell, hoveredItem, selectedItem} = props.classes;

    const {ctrl_type} = columns[columnIndex];
    const {star, toggle} = $p.enm.data_field_kinds;

    // оформление ячейки
    const classNames = classnames(this._getRowClassName(rowIndex), cell, {
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

    const dprops = {
      className: classNames,
      key: `cell-${rowIndex}-${columnIndex}`,
      style,
      onMouseOver,
      onClick,
      onDoubleClick: props.selectionMode ? handleSelect : handleEdit,
      title: hoveredColumnIndex == columnIndex && hoveredRowIndex == rowIndex ? content : '',
    };
    if(rowIndex == 0) {
      dprops.onMouseMove = onMouseMove;
    };


    return (
      <div {...dprops}>{rowIndex !== 0 && (ctrl_type === star || ctrl_type === toggle) && content ?
        <StarRate className={props.classes.star}/> : content}</div>
    );
  };

  _formatter(rowData, columnIndex) {
    const {columns} = this.state;
    const {id, type} = columns[columnIndex];
    const v = rowData[id];

    switch (control_by_type(type, v)) {
    case 'ocombo':
      return this.props._mgr.value_mgr(rowData, id, type, false, v).get(v).presentation;

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
  };

  _loadMoreRows = ({startIndex, stopIndex}) => {
    const {_mgr, _owner} = this.props;
    const {scheme, columns, rowsLoaded} = this.state;

    const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1);

    // в зависимости от типа кеширования...
    if(/ram$/.test(_mgr.cachable)) {
      // фильтруем в озу
      const selector = _mgr.get_search_selector({
        _obj: _owner ? _owner._obj : null,
        _meta: _owner ? _owner._meta : {},
        search: scheme._search,
        top: increment,
        skip: startIndex ? startIndex - 1 : 0,
      });
      return Promise.resolve(this._updateList(_mgr.find_rows(selector), startIndex));
    }
    else {
      // выполняем запрос
      const selector = _mgr.mango_selector ?
        _mgr.mango_selector(scheme, {
          columns,
          skip: startIndex ? startIndex - 1 : 0,
          limit: increment,
        }) :
        scheme.mango_selector({
          columns,
          skip: startIndex ? startIndex - 1 : 0,
          limit: increment,
        });

      return _mgr.find_rows_remote(selector)
        .then((data) => this._updateList(data, startIndex));
    }

  };
}


export default withStyles(withIface(DataList));
