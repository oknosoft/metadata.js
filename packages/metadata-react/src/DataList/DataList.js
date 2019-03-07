import React from 'react';
import PropTypes from 'prop-types';
import MDNRComponent from '../common/MDNRComponent';

import InfiniteLoader from 'react-virtualized/dist/es/InfiniteLoader';
import MultiGrid from 'react-virtualized/dist/es/MultiGrid';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import cn from 'classnames';
import Helmet from 'react-helmet';
import LoadingMessage from '../DumbLoader/LoadingMessage';
import DataListToolbar from './DataListToolbar';
import SchemeSettingsTabs from '../SchemeSettings/SchemeSettingsTabs';
import Confirm from '../App/Confirm';
import withStyles from './styles';
import {withIface} from 'metadata-redux';
import control_by_type from 'metadata-abstract-ui/ui';
import StarRate from '@material-ui/icons/StarRate';
import Typography from '@material-ui/core/Typography';

class DataList extends MDNRComponent {

  static LIMIT = 40;
  static OVERSCAN_ROW_COUNT = 2;
  static COLUMN_HEIGHT = 33;
  static COLUMN_DEFAULT_WIDTH = 220;

  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedRow: 0,
      scrollToRow: 0,
      scrollSetted: false,
      rowCount: 0,
      settings_open: false,
      network_error: '',
      no_rows: false,
      ref: '',
    };

    /** Set of grid rows. */
    this._list = [];

    this.handleManagerChange(props);
  }

  // при изменении менеджера данных
  handleManagerChange({_mgr, _meta, _ref}) {

    const {class_name} = _mgr;

    this._meta = _meta || _mgr.metadata();

    const newState = {ref: _ref || ''};

    if(this._mounted) {
      this.setState(newState);
    }
    else {
      Object.assign(this.state, newState);
    }

    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);

  }

  // обработчик выбора значения в списке
  handleSelect = () => {
    const {state: {selectedRow}, props: {handlers, _mgr}} = this;
    if(!selectedRow) {
      this.handleInfoText('Не выбрана строка');
    }
    else {
      const row = this._list[selectedRow];
      row && handlers.handleSelect && handlers.handleSelect(row, _mgr);
    }
  };

  // обработчик добавления элемента списка
  handleAdd = (event) => {
    const {handlers, _mgr} = this.props;
    handlers.handleAdd && handlers.handleAdd(_mgr, event);
  };

  // обработчик редактирования элемента списка
  handleEdit = () => {
    const {_list, _meta, state, props} = this;
    const {handlers, _mgr} = props;
    const row = _list[state.selectedRow];
    if(!row || $p.utils.is_empty_guid(row.ref)) {
      handlers.handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, text: 'Укажите строку для редактирования', title: _meta.synonym}
      });
    }
    else if(handlers.handleEdit) {
      handlers.handleEdit({row, ref: row.ref, _mgr});
    }
  };

  // обработчик удаления элемента списка
  handleRemove = () => {
    const {_list, _meta, state, props} = this;
    const {handlers, _mgr} = props;
    const row = _list[state.selectedRow];

    if(!row || $p.utils.is_empty_guid(row.ref)) {
      handlers.handleIfaceState({
        component: '',
        name: 'alert',
        value: {open: true, text: 'Укажите строку для удаления', title: _meta.synonym}
      });
    }
    else if(handlers.handleMarkDeleted) {
      this._handleRemove = () => {
        this.setState({confirm_text: ''}, () => {
          Promise.resolve()
            .then(() => handlers.handleMarkDeleted({row, ref: row.ref, _mgr}))
            .then(this.handleFilterChange)
            .catch((err) => this.setState({network_error: err}));
        });
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

    const {state, props, _list, _mounted} = this;

    if(!(scheme instanceof $p.CatScheme_settings)) {
      scheme = state.scheme;
    }

    if(!columns) {
      columns = state.columns;
    }

    // Set first row as header.
    _list.length = 0;
    _list.push(columns.map(column => (column.synonym)));

    const newState = {scheme, columns, scrollToRow: 1};
    if(_mounted) {
      this.setState(newState, () => {
        this._loadMoreRows({
          startIndex: 1,
          stopIndex: DataList.LIMIT - 1,
        });
      });
    }
    else {
      Object.assign(state, newState);
      this._loadMoreRows({
        startIndex: 1,
        stopIndex: DataList.LIMIT - 1,
      });
    }

  };

  ownerState = (state) => {
    state && this.setState(state);
    return this;
  };

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list[this.state.selectedRow];
    const {handlers, _mgr} = this.props;
    row && handlers.handlePrint && handlers.handlePrint(row, _mgr);
  };

  // обработчик вложений теущей строки
  handleAttachments = () => {
    const row = this._list[this.state.selectedRow];
    const {handlers, _mgr} = this.props;
    row && handlers.handleAttachments && handlers.handleAttachments(row, _mgr);
  };

  handleSettingsOpen = () => {
    this.setState({settings_open: true});
  };

  handleSettingsClose = () => {
    this.setState({settings_open: false});
  };

  handleConfirmClose = () => {
    this.setState({confirm_text: ''});
  };

  handleInfoText = (info_text) => {
    if(typeof info_text !== 'string') {
      info_text = '';
    }
    this.setState({info_text});
  }

  get sizes() {
    let {context: {dnr}, props: {width, height}, state: {columns}} = this;

    if(!height) {
      height = dnr && parseInt(dnr.frameRect.height) - 26;
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

    // горизонтальная прокрутка
    const w2 = columns && columns.reduce((sum, val, index) => {
      return sum + this._getColumnWidth({index});
    }, 0)
    if(w2 > width) {
      width = w2;
    }

    return {width, height};
  }

  get ltitle() {
    const {_mgr} = this.props;
    return `${_mgr.metadata().list_presentation || _mgr.metadata().synonym} (список)`;
  }

  render() {
    const {state, props, context, _meta, sizes, _isRowLoaded, _loadMoreRows, _cellRenderer, _list, handleFilterChange} = this;
    const {columns, scheme, confirm_text, info_text, settings_open, rowCount} = state;
    const {_mgr: {RepParams}, classes, title, registerFilterChange, width, height, GridRenderer, rowHeight, ...others} = props;

    if(!scheme) {
      return <LoadingMessage text="Чтение настроек компоновки..."/>;
    }
    else if(!columns || !columns.length) {
      return <LoadingMessage text="Ошибка настроек компоновки..."/>;
    }

    registerFilterChange && registerFilterChange(handleFilterChange);

    const show_grid = !settings_open || sizes.height > 572;

    const toolbar_props = {
      key: 'toolbar',
      scheme,
      ...others,
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
      handleFilterChange,
    };

    const Grid = GridRenderer || MultiGrid;

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
        handleCancel={this.handleConfirmClose}
        open
      />,

      info_text && <Confirm
        key="confirm"
        title={_meta.synonym}
        text={info_text}
        handleOk={this.handleInfoText}
        handleCancel={this.handleInfoText}
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
            tabParams={RepParams && <RepParams scheme={scheme} handleFilterChange={handleFilterChange}/>}
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
            rowCount={rowCount}
            minimumBatchSize={DataList.LIMIT / 2}>

            {({onRowsRendered, registerChild}) => {
              const onSectionRendered = ({rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex}) => {
                onRowsRendered({
                  overscanStartIndex: rowOverscanStartIndex,
                  overscanStopIndex: rowOverscanStopIndex,
                  startIndex: rowStartIndex * columns.length + columnStartIndex,
                  stopIndex: rowStopIndex * columns.length + columnStopIndex
                });
              };

              return (
                <Grid
                  ref={registerChild}
                  onRowsRendered={onRowsRendered}
                  onSectionRendered={onSectionRendered}
                  _list={this._list}
                  tabIndex={0}
                  width={width}
                  height={sizes.height - 52 - (settings_open ? 320 : 0)}
                  rowCount={rowCount}
                  columnCount={columns.length}
                  fixedRowCount={1}
                  noContentRenderer={this._noContentRendered}
                  cellRenderer={this._cellRenderer}
                  scrollToRow={state.scrollSetted ? state.scrollToRow : undefined}
                  overscanRowCount={DataList.OVERSCAN_ROW_COUNT}
                  columnWidth={this._getColumnWidth}
                  rowHeight={rowHeight || DataList.COLUMN_HEIGHT}
                  classNameTopRightGrid={cn(classes.topRightGrid, state.colResize && classes.colResize)}
                  ownerState={this.ownerState}
                />
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

  _noContentRendered = () => {
    const {no_rows, network_error}  = this.state;
    return <LoadingMessage text={network_error ?
      <div>
        <Typography variant="inherit">Ошибка сети, повторите запрос позже:</Typography>
        <Typography variant="inherit" color="error">{network_error.message || network_error.message}</Typography>
      </div>
      :
      (no_rows ? 'Записей не найдено...' : '')}
    />;
  };

  _cellRenderer = ({columnIndex, rowIndex, isScrolling, isVisible, key, parent, style}) => {
    const {state, props, handleEdit, handleSelect} = this;
    const {hoveredColumnIndex, hoveredRowIndex, selectedRow, columns} = state;
    const {cell, headerCell, hoveredItem, selectedItem, evenRow, oddRow} = props.classes;

    const {ctrl_type} = columns[columnIndex];
    const {star, toggle} = $p.enm.data_field_kinds;

    // оформление ячейки
    const classNames = cn(rowIndex % 2 === 0 ? evenRow : oddRow, cell, {
      [headerCell]: rowIndex === 0, // выравнивание текста по центру
      [hoveredItem]: rowIndex != 0 && rowIndex == hoveredRowIndex && rowIndex != selectedRow, // || columnIndex === this.state.hoveredColumnIndex
      [selectedItem]: rowIndex != 0 && rowIndex == selectedRow
    });

    // данные строки
    const row = this._list[rowIndex];

    // текст ячейки (header - data cell - empty cell)
    let content = rowIndex === 0 ? row[columnIndex] : row && this._formatter(row, columnIndex);
    if((ctrl_type === star || ctrl_type === toggle) && typeof content === 'number' && content <= 0) {
      content = '';
    }

    const onMouseOver = () => {
      this.setState({
        hoveredColumnIndex: columnIndex,
        hoveredRowIndex: rowIndex
      });
    };

    const onClick = () => this.setState({selectedRow: rowIndex});

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
      dprops.onMouseMove = ({target, clientX}) => {
        const br = target.getBoundingClientRect();
        const colResize = (Math.abs(br.left - clientX) < 6) || (Math.abs(br.right - clientX) < 6);
        colResize != this.state.colResize && this.setState({colResize});
      };
    };


    return (
      <div {...dprops}>
        {
          rowIndex !== 0 && (ctrl_type === star || ctrl_type === toggle) && content ?
            <StarRate className={props.classes.star}/>
            :
            content
        }
      </div>
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

    case 'calck':
      return v;

    default:
      return v ? v.toString() : '';
    }
  }

  _isRowLoaded = ({index}) => {
    return !!this._list[index];
  };

  _updateList = (data, startIndex, rowCount) => {
    const {_list} = this;

    // обновляем массив результата
    for (let i = 0; i < data.length; i++) {
      // Append one because first row is header.
      _list[i + startIndex] = data[i];
    }
    // Обновить количество записей.
    if(this._mounted) {
      if(rowCount === undefined) {
        rowCount = _list.length > 1 ? _list.length + 1 : 0;
      }
      const newState = {
        no_rows: rowCount <= 1,
        rowCount,
      };
      this.setState(newState);
    }
  };

  _loadMoreRows = ({startIndex, stopIndex}) => {
    const {props: {_mgr, _owner, find_rows}, state: {scheme, columns, ref, scrollSetted}, _list}  = this;

    //const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1);

    let increment = stopIndex - startIndex;
    if(!increment && _list[startIndex]) {
      return;
    }

    const newState = {no_rows: false, network_error: null};
    if(scrollSetted) {
      newState.scrollSetted = false;
      newState.scrollToRow = 0;
      newState.ref = '';
    }
    this.setState(newState);

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
      const sprm = {
        columns,
        skip: startIndex ? startIndex - 1 : 0,
        limit: increment + 1,
      };
      if(sprm.limit < DataList.LIMIT / 2) {
        sprm.limit = DataList.LIMIT / 2;
      }
      const selector = _mgr.mango_selector ? _mgr.mango_selector(scheme, sprm) : scheme.mango_selector(sprm);
      // если указано начальное значение списка, первый запрос делаем со ссылкой
      if(ref && !scrollSetted) {
        selector.ref = ref;
      }
      selector._raw = true;

      return (find_rows ? find_rows(selector, scheme) : _mgr.find_rows_remote(selector))
        .then((data) => {
          if(Array.isArray(data)) {
            this._updateList(data, startIndex);
          }
          else {
            const {docs, scroll, flag, count} = data;
            this._updateList(docs, startIndex, count ? count + 1 : count);
            if(ref && !scrollSetted) {
              const newState = {
                scrollSetted: true,
                ref: '',
              }
              if(!flag && scroll !== null) {
                newState.selectedRow = scroll + 1;
                newState.scrollToRow = newState.selectedRow + 4 < count ? newState.selectedRow + 4 : newState.selectedRow;
              }
              this.setState(newState);
              if(newState.scrollToRow && (!_list[newState.selectedRow] || !_list[newState.scrollToRow])) {
                const opt = {
                  startIndex: newState.scrollToRow - DataList.LIMIT / 2,
                  stopIndex: newState.scrollToRow + DataList.LIMIT / 2,
                };
                if(opt.startIndex < 1) {
                  opt.startIndex = 1;
                }
                if(opt.stopIndex > count) {
                  opt.stopIndex = count;
                }
                this._loadMoreRows(opt);
              }
            }
          }
        })
        .catch((err) => {
          this.setState({network_error: err});
          setTimeout(this.handleFilterChange, 2000);
        });
    }

  };
}

DataList.propTypes = {

  // данные
  _mgr: PropTypes.object.isRequired,    // Менеджер данных
  _acl: PropTypes.string,               // Права на чтение-изменение
  _meta: PropTypes.object,              // Описание метаданных. Если не указано, используем метаданные менеджера
  _ref: PropTypes.string,                // Ссылка, на которую надо спозиционироваться

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


export default withStyles(withIface(DataList));
