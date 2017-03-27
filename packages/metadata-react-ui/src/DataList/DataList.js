/** @flow */
import React, {Component, PropTypes} from "react";
import MetaComponent from "../common/MetaComponent";

import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import DumbLoader from "../DumbLoader";
import Toolbar from "./DataListToolbar";
import cn from "classnames";
import styles from "./DataList.scss";

class MapLikeStorage {
  constructor() {
    this._length = 0;
    this._data = Object.create(null);
  }

  get size() {
    return this._length;
  }

  get(index) {
    return this._data[index];
  }

  set(index, value) {
    this._data[index] = value;
    this._length++;
  }

  has(index) {
    return (index in this._data);
  }

  clear() {
    this._length = 0;
    this._data = Object.create(null);
  }
}

export default class DataList extends MetaComponent {
  static HEADER_HIGHT = 40;
  static LIMIT = 30;
  static OVERSCAN_ROW_COUNT = 10;
  static ROW_HEIGHT = 40;
  static TOTAL_ROWS = 999999;


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
      totalRowCount: DataList.TOTAL_ROWS,
      selectedRowIndex: 0,
      do_reload: false,
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

    this._list = new MapLikeStorage();
    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);
  }

  componentDidUpdate(prevProps, prevState) {
    // If props/state signals that the underlying collection has changed,
    // Reload the most recently requested batch of rows:
    if (this.state.do_reload) {
      this.state.do_reload = false;
      this._loadMoreRows({
        startIndex: 0,
        stopIndex: 29
      })
    }
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
    const {handleRemove, _mgr} = this.props
    if (row && handleRemove) {
      handleRemove(row, _mgr)
    }
  }

  // обработчик при изменении настроек компоновки
  handleSchemeChange = (scheme) => {
    const {state, props, _list} = this
    const {_mgr, params} = props

    scheme.set_default().fix_select(state.select, params && params.options || _mgr.class_name);

    _list.clear()
    this.setState({
      scheme,
      columns: scheme.columns(),
      totalRowCount: 0,
      do_reload: true,
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
    } = this

    const {
      columns,
      totalRowCount,
      scheme
    } = state

    const {
      selection_mode,
      deny_add_del,
      show_search,
      show_variants
    } = props

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
            rowCount={DataList.TOTAL_ROWS}
            minimumBatchSize={DataList.LIMIT}>

            {({onRowsRendered, registerChild}) => {
              const onSectionRendered = ({rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex}) => {
                onRowsRendered({
                  overscanStartIndex: rowOverscanStartIndex,
                  overscanStopIndex: rowOverscanStopIndex,
                  startIndex: rowStartIndex,
                  stopIndex: rowStopIndex
                })
              }

              return (
                <AutoSizer>
                  {({ width, height }) => (
                    <Table
                      ref={registerChild}
                      width={width}
                      height={height}

                      noRowsRenderer={this._noRowsRenderer}
                      overscanRowCount={DataList.OVERSCAN_ROW_COUNT}
                      rowHeight={DataList.ROW_HEIGHT}
                      headerHeight={DataList.HEADER_HIGHT}
                      rowCount={DataList.TOTAL_ROWS}
                      rowGetter={this._rowGetter}
                      rowClassName={styles.row}>

                      {columns.map((column, columnIndex) => (
                        <Column
                          key={columnIndex}
                          dataKey={column.id}
                          width={columns.length > 0 ? width / columns.length : 0}
                          label={column.synonym} />
                      ))}
                    </Table>
                  )}
                </AutoSizer>
              )
            }}
          </InfiniteLoader>
        </div>
      </div>
    )
  }

  // cellRenderer={this._cellRenderer()}
  // headerRenderer={this._headerRenderer()}

  /**
   * Callback responsible for rendering a cell's contents.
   * @param  {any}     options.cellData
   * @param  {any}     options.columnData
   * @param  {string}  options.dataKey
   * @param  {boolean} options.isScrolling
   * @param  {any}     options.rowData
   * @param  {number}  options.rowIndex
   * @return {element}
   *
   * _cellRenderer({ cellData, columnData, dataKey, isScrolling, rowData, rowIndex }) {
   *   const {
   *     state,
   *     props,
   *     _list,
   *     handleEdit,
   *     handleSelect
   *   } = this
   *
   *   const {
   *     hoveredColumnIndex,
   *     hoveredRowIndex,
   *     selectedRowIndex
   *   } = state
   *
   *   // оформление ячейки
   *   const classNames = cn(this._getRowClassName(rowIndex), styles.cell, {
   *     //[styles.centeredCell]: columnIndex > 3, // выравнивание текста по центру
   *     [styles.hoveredItem]: rowIndex == hoveredRowIndex && rowIndex != selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
   *     [styles.selectedItem]: rowIndex == selectedRowIndex
   *   })
   *
   *   // данные строки
   *   const row = _list.get(rowIndex)
   *
   *   // текст ячейки
   *   const content = row ? this._formatter(row, columnIndex) : (
   *     <div className={styles.placeholder} style={{ width: 10 + Math.random() * 80 }} />
   *   )
   *
   *   const onMouseOver = () => {
   *     this.setState({
   *       hoveredColumnIndex: columnIndex,
   *       hoveredRowIndex: rowIndex
   *     })
   *   }
   *
   *   const onTouchTap = () => {
   *     this.setState({
   *       selectedRowIndex: rowIndex
   *     })
   *   }
   *
   *   return (
   *     <div
   *       className={classNames}
   *       key={rowIndex}
   *       style={style}
   *       onMouseOver={onMouseOver}
   *       onTouchTap={onTouchTap}
   *       onDoubleClick={props.selection_mode ? handleSelect : handleEdit}
   *       title={hoveredColumnIndex == columnIndex && hoveredRowIndex == rowIndex ? content : ''}>
   *       {content}
   *     </div>
   *   );
   * }
   */

  /**
   * Optional callback responsible for rendering a column's header column.
   * @param  {[type]} options.columnData
   * @param  {[type]} options.dataKey
   * @param  {[type]} options.disableSort
   * @param  {[type]} options.label
   * @param  {[type]} options.sortBy
   * @param  {[type]} options.sortDirection
   * @return {[type]}
   *
   * _headerRenderer({ columnData, dataKey, disableSort, label, sortBy, sortDirection }) {
   * }
   */

  _formatter(row, index) {
    const {$p} = this.context
    const {columns} = this.state
    const column = columns[index]
    const v = row[column.id]

    switch ($p.UI.control_by_type(column.type, v)) {
      case 'ocombo':
        return $p.utils.value_mgr(row, column.id, column.type, false, v).get(v).presentation

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

  _loadMoreRows = ({startIndex, stopIndex}) => {
    const {select, scheme, totalRowCount} = this.state
    const {_mgr, params} = this.props
    const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1)

    Object.assign(select, {
      _top: increment,
      _skip: startIndex,
      _view: 'doc/by_date',
      _raw: true
    })

    scheme.fix_select(select, params && params.options || _mgr.class_name)

    // выполняем запрос
    return _mgr.find_rows_remote(select).then((data) => {
      // обновляем массив результата
      for (var i = 0; i < data.length; i++) {
        if (this._list.has(i + startIndex) === false) {
          this._list.set(i + startIndex, data[i]);
        }
      }

      // обновляем состояние - изменилось количество записей
      if (totalRowCount != startIndex + data.length + (data.length < increment ? 0 : increment )) {
        this.setState({
          totalRowCount: startIndex + data.length + (data.length < increment ? 0 : increment )
        })
      } else {
        this.forceUpdate()
      }
    })
  }

  /**
   * Callback used to render placeholder content when :rowCount is 0.
   * @return {element} placeholder
   */
  _noRowsRenderer = () => {
    return <DumbLoader title="Загрузка списка..." />;
  }

  /**
   * Callback responsible for returning a data row given an index.
   * @param  {number} options.index
   * @return {any}
   */
  _rowGetter = ({ index }) => {
    return this._list.get(index);
  }
}