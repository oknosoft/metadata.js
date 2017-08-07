"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _reactVirtualized = require("react-virtualized");

var _DumbLoader = require("../DumbLoader");

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

var _SimpleLoadingMessage = require("../SimpleLoadingMessage");

var _SimpleLoadingMessage2 = _interopRequireDefault(_SimpleLoadingMessage);

var _DataListToolbar = require("./DataListToolbar");

var _DataListToolbar2 = _interopRequireDefault(_DataListToolbar);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DataList = require("./DataList.scss");

var _DataList2 = _interopRequireDefault(_DataList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataList extends _MetaComponent2.default {

  constructor(props, context) {
    super(props, context);

    _initialiseProps.call(this);

    const { class_name } = props._mgr;
    const { $p } = context;

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

      /** Set of grid rows. */
    };this._list = new Map();
    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);

    this._isMounted = false;
  }

  // обработчик выбора значения в списке


  // обработчик добавления элемента списка


  // обработчик редактирования элемента списка


  // обработчик удаления элемента списка


  // обработчик при изменении настроек компоновки


  // обработчик печати теущей строки


  // обработчик вложений теущей строки


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
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u0427\u0442\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
    } else if (!columns || !columns.length) {
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
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
    };

    return _react2.default.createElement(
      "div",
      { className: "content-with-toolbar-layout" },
      _react2.default.createElement(
        "div",
        { className: "content-with-toolbar-layout__toolbar" },
        _react2.default.createElement(_DataListToolbar2.default, toolbar_props)
      ),
      _react2.default.createElement(
        "div",
        { className: "content-with-toolbar-layout__content" },
        _react2.default.createElement(
          _reactVirtualized.InfiniteLoader,
          {
            isRowLoaded: _isRowLoaded,
            loadMoreRows: _loadMoreRows,
            rowCount: this.state.rowsLoaded + DataList.LIMIT,
            minimumBatchSize: DataList.LIMIT },
          ({ onRowsRendered, registerChild }) => {
            const onSectionRendered = ({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex, columnStartIndex, columnStopIndex }) => {
              onRowsRendered({
                overscanStartIndex: rowOverscanStartIndex,
                overscanStopIndex: rowOverscanStopIndex,
                startIndex: rowStartIndex * this.state.columns.length + columnStartIndex,
                stopIndex: rowStopIndex * this.state.columns.length + columnStopIndex
              });
            };

            return _react2.default.createElement(
              _reactVirtualized.AutoSizer,
              null,
              ({ width, height }) => _react2.default.createElement(_reactVirtualized.MultiGrid, {
                ref: registerChild,
                width: width,
                height: height,
                rowCount: this.state.rowsLoaded,
                columnCount: this.state.columns.length,
                fixedColumnCount: 0,
                fixedRowCount: 1,
                noContentRenderer: this._noContentRendered,
                cellRenderer: this._cellRenderer,
                overscanColumnCount: DataList.OVERSCAN_COLUMN_COUNT,
                overscanRowCount: DataList.OVERSCAN_ROW_COUNT,
                columnWidth: this._getColumnWidth,
                rowHeight: DataList.COLUMN_HEIGHT,
                onSectionRendered: onSectionRendered,
                styleTopRightGrid: {
                  backgroundColor: "#fffbdc",
                  borderBottom: "1px solid #e0e0e0"
                } })
            );
          }
        )
      )
    );
  }

  _formatter(rowData, columnIndex) {
    const { $p } = this.context;
    const { columns } = this.state;
    const column = columns[columnIndex];
    const v = rowData[column.id];

    switch ($p.UI.control_by_type(column.type, v)) {
      case 'ocombo':
        return $p.utils.value_mgr(rowData, column.id, column.type, false, v).get(v).presentation;

      case 'dhxCalendar':
        return $p.utils.moment(v).format($p.utils.moment._masks.date);

      default:
        return v;
    }
  }

  _getRowClassName(row) {
    return row % 2 === 0 ? _DataList2.default.evenRow : _DataList2.default.oddRow;
  }

}
exports.default = DataList;
DataList.LIMIT = 10;
DataList.OVERSCAN_ROW_COUNT = 2;
DataList.OVERSCAN_COLUMN_COUNT = 2;
DataList.COLUMN_HEIGHT = 40;
DataList.COLUMN_DEFAULT_WIDTH = 250;
DataList.propTypes = {
  // данные
  _mgr: _propTypes2.default.object.isRequired, // Менеджер данных
  _meta: _propTypes2.default.object, // Описание метаданных. Если не указано, используем метаданные менеджера

  // настройки компоновки
  select: _propTypes2.default.object, // todo: переместить в scheme // Параметры запроса к couchdb. Если не указано - генерируем по метаданным

  // настройки внешнего вида и поведения
  selection_mode: _propTypes2.default.bool, // Режим выбора из списка. Если истина - дополнительно рисуем кнопку выбора
  read_only: _propTypes2.default.object, // Элемент только для чтения
  deny_add_del: _propTypes2.default.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  show_search: _propTypes2.default.bool, // Показывать поле поиска
  show_variants: _propTypes2.default.bool, // Показывать список вариантов настройки динсписка
  modal: _propTypes2.default.bool, // Показывать список в модальном диалоге
  Toolbar: _propTypes2.default.func, // Индивидуальная панель инструментов. Если не указана, рисуем типовую

  // Redux actions
  handleSelect: _propTypes2.default.func, // обработчик выбора значения в списке
  handleAdd: _propTypes2.default.func, // обработчик добавления объекта
  handleEdit: _propTypes2.default.func, // обработчик открытия формы редактора
  handleRevert: _propTypes2.default.func, // откатить изменения - перечитать объект из базы данных
  handleMarkDeleted: _propTypes2.default.func, // обработчик удаления строки
  handlePost: _propTypes2.default.func, // обработчик проведения документа
  handleUnPost: _propTypes2.default.func, // отмена проведения
  handlePrint: _propTypes2.default.func, // обработчик открытия диалога печати
  handleAttachment: _propTypes2.default.func // обработчик открытия диалога присоединенных файлов
};

var _initialiseProps = function () {
  this.handleSelect = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const { handleSelect, _mgr } = this.props;
    if (row && handleSelect) {
      handleSelect(row, _mgr);
    }
  };

  this.handleAdd = () => {
    const { handleAdd, _mgr } = this.props;
    if (handleAdd) {
      handleAdd(_mgr);
    }
  };

  this.handleEdit = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const { handleEdit, _mgr } = this.props;
    if (row && handleEdit) {
      handleEdit(row, _mgr);
    }
  };

  this.handleRemove = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const { handleMarkDeleted, _mgr } = this.props;

    if (row && handleMarkDeleted) {
      handleMarkDeleted(row, _mgr);
    }
  };

  this.handleSchemeChange = scheme => {
    const { state, props } = this;
    const { _mgr, params } = props;

    scheme.set_default().fix_select(state.select, params && params.options || _mgr.class_name);
    this._list.clear();

    // Create header row.
    const columns = scheme.columns();
    const headerColumns = columns.map(column => column.synonym);

    // Set first row as header.
    this._list.set(0, headerColumns);
    this.setState({
      scheme,
      columns,
      rowsLoaded: 1
    });

    this._loadMoreRows({
      startIndex: 0,
      stopIndex: DataList.LIMIT
    });
  };

  this.handlePrint = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const { handlePrint, _mgr } = this.props;
    if (row && handlePrint) {
      handlePrint(row, _mgr);
    }
  };

  this.handleAttachment = () => {
    const row = this._list.get(this.state.selectedRowIndex);
    const { handleAttachment, _mgr } = this.props;
    if (row && handleAttachment) {
      handleAttachment(row, _mgr);
    }
  };

  this._getColumnWidth = ({ index }) => {
    // todo: Take remaining space if width of column equal '*'
    if (!isNaN(parseInt(this.state.columns[index].width))) {
      return DataList.COLUMN_DEFAULT_WIDTH;
    } else {
      return parseInt(this.state.columns[index].width);
    }
  };

  this._noContentRendered = () => {
    return _react2.default.createElement(_SimpleLoadingMessage2.default, null);
  };

  this._cellRenderer = ({ columnIndex, rowIndex, isScrolling, isVisible, key, parent, style }) => {
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
    const classNames = (0, _classnames2.default)(this._getRowClassName(rowIndex), _DataList2.default.cell, {
      //[styles.centeredCell]: columnIndex > 3, // выравнивание текста по центру
      [_DataList2.default.hoveredItem]: rowIndex == hoveredRowIndex && rowIndex != selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
      [_DataList2.default.selectedItem]: rowIndex == selectedRowIndex
    });

    // данные строки
    const row = this._list.get(rowIndex);

    // текст ячейки
    let content = null;
    if (rowIndex === 0) {
      content = _react2.default.createElement(
        "div",
        null,
        " ",
        row[columnIndex],
        " "
      ); // header
    } else if (row) {
      content = this._formatter(row, columnIndex); // data cell
    } else {
      content = null; // empty cell
    }

    const onMouseOver = () => {
      this.setState({
        hoveredColumnIndex: columnIndex,
        hoveredRowIndex: rowIndex
      });
    };

    const onTouchTap = () => {
      this.setState({
        selectedRowIndex: rowIndex
      });
    };

    return _react2.default.createElement(
      "div",
      {
        className: classNames,
        key: `cell-${rowIndex}-${columnIndex}`,
        style: style,
        onMouseOver: onMouseOver,
        onTouchTap: onTouchTap,
        onDoubleClick: props.selection_mode ? handleSelect : handleEdit,
        title: hoveredColumnIndex == columnIndex && hoveredRowIndex == rowIndex ? content : '' },
      content
    );
  };

  this._isRowLoaded = ({ index }) => {
    return this._list.has(index);
  };

  this._loadMoreRows = ({ startIndex, stopIndex }) => {
    const { select, scheme, rowsLoaded } = this.state;
    const { _mgr, params } = this.props;
    const increment = Math.max(DataList.LIMIT, stopIndex - startIndex + 1);

    Object.assign(select, {
      _top: increment,
      _skip: startIndex,
      _view: 'doc/by_date',
      _raw: true
    });

    scheme.fix_select(select, params && params.options || _mgr.class_name);
    // выполняем запрос
    return _mgr.find_rows_remote(select).then(data => {

      let reallyLoadedRows = 0;
      // обновляем массив результата
      for (var i = 0; i < data.length; i++) {
        // Append one because first row is header.
        if (this._list.has(1 + i + startIndex) === false) {
          reallyLoadedRows++;
          this._list.set(1 + i + startIndex, data[i]);
        }
      }

      if (this._isMounted) {
        // Обновить количество записей.
        this.setState({
          rowsLoaded: this.state.rowsLoaded + reallyLoadedRows
        });
      }
    });
  };
};