/** @flow */
import React, {Component, PropTypes} from "react";
import MetaComponent from "../common/MetaComponent";

import { InfiniteLoader, AutoSizer, MultiGrid } from "react-virtualized";
import DumbLoader from "../DumbLoader";
import Toolbar from "./DataListToolbar";
import cn from "classnames";
import styles from "./DataList.scss";

export default class DataList extends MetaComponent {
  static LIMIT = 10;
  static OVERSCAN_ROW_COUNT = 2;
  static OVERSCAN_COLUMN_COUNT = 2;
  static COLUMN_HEIGHT = 40;
  static COLUMN_DEFAULT_WIDTH = 250;

  static propTypes = {
    // данные
    _mgr: PropTypes.object.isRequired,    // Менеджер данных
    _meta: PropTypes.object,              // Описание метаданных. Если не указано, используем метаданные менеджера

    // настройки компоновки
    select: PropTypes.object,             // todo: переместить в scheme // Параметры запроса к couchdb. Если не указано - генерируем по метаданным

    // настройки внешнего вида и поведения
    selection_mode: PropTypes.bool,       // Режим выбора из списка. Если истина - дополнительно рисуем кнопку выбора
    read_only: PropTypes.object,          // Элемент только для чтения
    deny_add_del: PropTypes.bool,         // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
    show_search: PropTypes.bool,          // Показывать поле поиска
    show_variants: PropTypes.bool,        // Показывать список вариантов настройки динсписка
    modal: PropTypes.bool,                // Показывать список в модальном диалоге
    Toolbar: PropTypes.func,              // Индивидуальная панель инструментов. Если не указана, рисуем типовую

    // Redux actions
    handleSelect: PropTypes.func,         // обработчик выбора значения в списке
    handleAdd: PropTypes.func,            // обработчик добавления объекта
    handleEdit: PropTypes.func,           // обработчик открытия формы редактора
    handleRevert: PropTypes.func,         // откатить изменения - перечитать объект из базы данных
    handleMarkDeleted: PropTypes.func,    // обработчик удаления строки
    handlePost: PropTypes.func,           // обработчик проведения документа
    handleUnPost: PropTypes.func,         // отмена проведения
    handlePrint: PropTypes.func,          // обработчик открытия диалога печати
    handleAttachment: PropTypes.func,     // обработчик открытия диалога присоединенных файлов
  }

  constructor(props, context) {
    super(props, context);

    const {class_name} = props._mgr;
    const {$p} = context;

    const state = this.state = {
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
    }

    /** Set of grid rows. */
    this._list = new Map();
    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);

    this._isMounted = false;
    this._multiGridReference = null;
  }

  // обработчик выбора значения в списке
  handleSelect = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleSelect, _mgr} = this.props
    if (row && handleSelect) {
      handleSelect(row, _mgr)
    }
  }

  // обработчик добавления элемента списка
  handleAdd = () => {
    const {handleAdd, _mgr} = this.props
    if (handleAdd) {
      handleAdd(_mgr)
    }
  }

  // обработчик редактирования элемента списка
  handleEdit = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleEdit, _mgr} = this.props
    if (row && handleEdit) {
      handleEdit(row, _mgr)
    }
  }

  // обработчик удаления элемента списка
  handleRemove = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleMarkDeleted, _mgr} = this.props

    if (row && handleMarkDeleted) {
      handleMarkDeleted(row, _mgr)
    }
  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {
    const {state, props} = this;
    const {_mgr, params} = props;

    scheme.set_default().fix_select(state.select, params && params.options || _mgr.class_name);
    this._list.clear();

    // Create header row.
    const columns = scheme.columns();
    const headerColumns = columns.map(column => (column.synonym));

    // Set first row as header.
    this._list.set(0, headerColumns);
    this.setState({
      scheme,
      columns,
      rowsLoaded: 1,
    });

    this._loadMoreRows({
      startIndex: 1,
      stopIndex: DataList.LIMIT
    });
  }

  // обработчик печати теущей строки
  handlePrint = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handlePrint, _mgr} = this.props
    if (row && handlePrint) {
      handlePrint(row, _mgr)
    }
  }

  // обработчик вложений теущей строки
  handleAttachment = () => {
    const row = this._list.get(this.state.selectedRowIndex)
    const {handleAttachment, _mgr} = this.props
    if (row && handleAttachment) {
      handleAttachment(row, _mgr)
    }
  }

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

    const {
      columns,
      rowsLoaded,
      scheme
    } = state;

    const {
      selection_mode,
      deny_add_del,
      show_search,
      show_variants
    } = props;

    if (!scheme) {
      return <DumbLoader title="Чтение настроек компоновки..."/>
    }

    else if (!columns || !columns.length) {
      return <DumbLoader title="Ошибка настроек компоновки..."/>
    }

    const toolbar_props = {
      scheme,
      selection_mode,
      deny_add_del,
      show_search,
      show_variants,
      handleSelect,
      handleAdd,
      handleEdit,
      handleRemove,
      handlePrint,
      handleAttachment,
      handleSchemeChange
    }

    return (
      <div className={styles.dataList}>
        <div className={styles.dataListToolbar}>
          <Toolbar {...toolbar_props} />
        </div>

        <div className={styles.dataListContent}>
          <InfiniteLoader
            isRowLoaded={_isRowLoaded}
            loadMoreRows={_loadMoreRows}
            rowCount={this.state.rowsLoaded + DataList.LIMIT}
            minimumBatchSize={DataList.LIMIT}>

            {({onRowsRendered, registerChild}) => {
              const onSectionRendered = ({rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex }) => {
                onRowsRendered({
                  overscanStartIndex: rowOverscanStartIndex,
                  overscanStopIndex: rowOverscanStopIndex,
                  startIndex: rowStartIndex * this.state.columns.length + columnStartIndex,
                  stopIndex:  rowStopIndex  * this.state.columns.length + columnStopIndex
                })
              }

              return (
                <AutoSizer>
                  {({ width, height }) => (
                    <MultiGrid
                      ref={(reference) => {
                        this._multiGridReference = reference;
                        return registerChild;
                      }}
                      width={width}
                      height={height}
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
                      styleTopRightGrid={{
                          backgroundColor: "#fffbdc",
                          borderBottom: "1px solid #e0e0e0",
                      }} />
                  )}
                </AutoSizer>
              )
            }}
          </InfiniteLoader>
        </div>
      </div>
    )
  }

  _getColumnWidth = ({ index }) => {
    // todo: Take remaining space if width of column equal '*'
    if (!isNaN(parseInt(this.state.columns[index].width))) {
      return DataList.COLUMN_DEFAULT_WIDTH;
    } else {
      return parseInt(this.state.columns[index].width);
    }
  }

  _noContentRendered = () => {
    const message = "загрузка...";

    return (
      <div className={styles.noContentRenderer}>
        <div className={styles.noContentRenderer__text}>
          {message}
        </div>
      </div>
    );
  }

  _cellRenderer = ({ columnIndex, rowIndex, isScrolling, isVisible, key, parent, style }) => {
    const {
      state,
      props,
      handleEdit,
      handleSelect
    } = this;

    const {
      hoveredColumnIndex,
      hoveredRowIndex,
      selectedRowIndex
    } = state;

    // оформление ячейки
    const classNames = cn(this._getRowClassName(rowIndex), styles.cell, {
      //[styles.centeredCell]: columnIndex > 3, // выравнивание текста по центру
      [styles.hoveredItem]: rowIndex == hoveredRowIndex && rowIndex != selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
      [styles.selectedItem]: rowIndex == selectedRowIndex
    });

    // данные строки
    const row = this._list.get(rowIndex);

    // текст ячейки
    let content = null;
    if (rowIndex === 0) {
      content = <div> {row[columnIndex]} </div>; // header
    } else if (row) {
      content = this._formatter(row, columnIndex); // data cell
    } else {
      content = null; // empty cell
    }

    const onMouseOver = () => {
      this.setState({
        hoveredColumnIndex: columnIndex,
        hoveredRowIndex: rowIndex
      })
    };

    const onTouchTap = () => {
      this.setState({
        selectedRowIndex: rowIndex
      })
    };

    return (
      <div
        className={classNames}
        key={`cell-${rowIndex}-${columnIndex}`}
        style={style}
        onMouseOver={onMouseOver}
        onTouchTap={onTouchTap}
        onDoubleClick={props.selection_mode ? handleSelect : handleEdit}
        title={hoveredColumnIndex == columnIndex && hoveredRowIndex == rowIndex ? content : ''}>
        {content}
      </div>
    );
  }

  _formatter(rowData, columnIndex) {
    const {$p} = this.context
    const {columns} = this.state
    const column = columns[columnIndex]
    const v = rowData[column.id]

    switch ($p.UI.control_by_type(column.type, v)) {
      case 'ocombo':
        return $p.utils.value_mgr(rowData, column.id, column.type, false, v).get(v).presentation

      case 'dhxCalendar':
        return $p.utils.moment(v).format($p.utils.moment._masks.date)

      default:
        return v
    }
  }

  _getRowClassName(row) {
    return row % 2 === 0 ? styles.evenRow : styles.oddRow
  }

  _isRowLoaded = ({ index }) => {
    return this._list.has(index);
  }

  _loadMoreRows = ({ startIndex, stopIndex }) => {
    const {select, scheme, rowsLoaded} = this.state
    const {_mgr, params} = this.props
    const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1);

    Object.assign(select, {
      _top: increment,
      _skip: startIndex, // Substract one because first row is header.
      _view: 'doc/by_date',
      _raw: true
    });

    scheme.fix_select(select, params && params.options || _mgr.class_name);
    // выполняем запрос
    return _mgr.find_rows_remote(select).then((data) => {
      // обновляем массив результата
      for (var i = 0; i < data.length; i++) {
        if (this._list.has(i + startIndex) === false) {
          this._list.set(i + startIndex, data[i]);
        }
      }

      if (this._isMounted) {
        // Обновить количество записей.
        this.setState({
          rowsLoaded: this.state.rowsLoaded + data.length
        });
      }
    });
  }
}