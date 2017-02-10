"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _MetaComponent = require("../common/MetaComponent");

var _MetaComponent2 = _interopRequireDefault(_MetaComponent);

var _reactVirtualized = require("react-virtualized");

var _DumbLoader = require("../DumbLoader");

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

var _DataListToolbar = require("./DataListToolbar");

var _DataListToolbar2 = _interopRequireDefault(_DataListToolbar);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DataList = require("./DataList.scss");

var _DataList2 = _interopRequireDefault(_DataList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const limit = 30,
      totalRows = 999999;


class DataListStorage {

  constructor() {
    this._data = [];
  }

  get size() {
    return this._data.length;
  }

  get(index) {
    return this._data[index];
  }

  clear() {
    this._data.length = 0;
  }

}

class DataList extends _MetaComponent2.default {

  constructor(props, context) {

    super(props, context);

    _initialiseProps.call(this);

    const { class_name } = props._mgr;
    const { $p } = context;

    const state = this.state = {
      totalRowCount: totalRows,
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
    };

    this._list = new DataListStorage();

    $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);
  }

  componentDidUpdate(prevProps, prevState) {
    // If props/state signals that the underlying collection has changed,
    // Reload the most recently requested batch of rows:
    if (this.state.do_reload) {
      this.state.do_reload = false;
      this._loadMoreRows({
        startIndex: 0,
        stopIndex: 30
      });
    }
  }

  // обработчик выбора значения в списке


  // обработчик добавления элемента списка


  // обработчик редактирования элемента списка


  // обработчик удаления элемента списка


  // обработчик при изменении настроек компоновки


  // обработчик печати теущей строки


  // обработчик вложений теущей строки


  render() {

    const { state, props, handleSelect, handleAdd, handleEdit, handleRemove, handlePrint, handleAttachment,
      handleSchemeChange, _isRowLoaded, _loadMoreRows, _cellRenderer } = this;
    const { columns, totalRowCount, scheme } = state;
    const { width, height, selection_mode, deny_add_del, show_search, show_variants } = props;

    if (!scheme) {
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u0427\u0442\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
    } else if (!columns || !columns.length) {
      return _react2.default.createElement(_DumbLoader2.default, { title: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
    }

    const toolbar_props = { scheme, selection_mode, deny_add_del, show_search, show_variants, handleSelect, handleAdd,
      handleEdit, handleRemove, handlePrint, handleAttachment, handleSchemeChange };

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(_DataListToolbar2.default, toolbar_props),
      _react2.default.createElement(
        _reactVirtualized.InfiniteLoader,
        {
          isRowLoaded: _isRowLoaded,
          loadMoreRows: _loadMoreRows,
          rowCount: totalRowCount,
          minimumBatchSize: limit
        },
        ({ onRowsRendered, registerChild }) => {

          const onSectionRendered = ({ rowOverscanStartIndex, rowOverscanStopIndex, rowStartIndex, rowStopIndex }) => {

            onRowsRendered({
              overscanStartIndex: rowOverscanStartIndex,
              overscanStopIndex: rowOverscanStopIndex,
              startIndex: rowStartIndex,
              stopIndex: rowStopIndex
            });
          };

          let left = 0;

          return _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(
              "div",
              {
                //className={styles.BodyGrid}
                style: { position: 'relative', zIndex: -1 } },
              columns.map(function (column, index) {

                let res = _react2.default.createElement(
                  "div",
                  {
                    key: 'caption_' + column.id,
                    className: (0, _classnames2.default)(_DataList2.default.oddRow, _DataList2.default.cell),
                    style: {
                      position: 'absolute',
                      top: 0,
                      height: 30,
                      width: column.width,
                      left: left
                    } },
                  column.synonym
                );

                left += column.width;

                return res;
              })
            ),
            _react2.default.createElement(_reactVirtualized.Grid, {
              ref: registerChild
              //className={styles.BodyGrid}
              , onSectionRendered: onSectionRendered,
              cellRenderer: _cellRenderer,
              columnCount: columns.length,
              columnWidth: ({ index }) => columns[index].width,
              rowCount: totalRowCount,
              rowHeight: 30,
              width: width,
              height: height - 90,
              style: { top: 30 }
            })
          );
        }
      )
    );
  }

  _formatter(row, index) {

    const { $p } = this.context;
    const { columns } = this.state;
    const column = columns[index];
    const v = row[column.id];

    switch ($p.UI.control_by_type(column.type, v)) {

      case 'ocombo':
        return $p.utils.value_mgr(row, column.id, column.type, false, v).get(v).presentation;

      case 'dhxCalendar':
        return $p.utils.moment(v).format($p.utils.moment._masks.date);

      default:
        return v;

    }
  }

  _getRowClassName(row) {
    return row % 2 === 0 ? _DataList2.default.evenRow : _DataList2.default.oddRow;
  }

  /**
   *
   * @param columnIndex - Horizontal (column) index of cell
   * @param isScrolling - The Grid is currently being scrolled
   * @param key - Unique key within array of cells
   * @param rowIndex - Vertical (row) index of cell
   * @param style - Style object to be applied to cell
   * @return {Component}
   * @private
   */
}
exports.default = DataList;
DataList.propTypes = {

  // данные
  _mgr: _react.PropTypes.object.isRequired, // Менеджер данных
  _meta: _react.PropTypes.object, // Описание метаданных. Если не указано, используем метаданные менеджера

  // настройки компоновки
  select: _react.PropTypes.object, // todo: переместить в scheme // Параметры запроса к couchdb. Если не указано - генерируем по метаданным

  // настройки внешнего вида и поведения
  selection_mode: _react.PropTypes.bool, // Режим выбора из списка. Если истина - дополнительно рисум кнопку выбора
  read_only: _react.PropTypes.object, // Элемент только для чтения
  deny_add_del: _react.PropTypes.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  show_search: _react.PropTypes.bool, // Показывать поле поиска
  show_variants: _react.PropTypes.bool, // Показывать список вариантов настройки динсписка
  modal: _react.PropTypes.bool, // Показывать список в модальном диалоге
  width: _react.PropTypes.number.isRequired, // Ширина элемента управления - вычисляется родительским компонентом с помощью `react-virtualized/AutoSizer`
  height: _react.PropTypes.number.isRequired, // Высота элемента управления - вычисляется родительским компонентом с помощью `react-virtualized/AutoSizer`


  Toolbar: _react.PropTypes.func, // Индивидуальная панель инструментов. Если не указана, рисуем типовую

  // Redux actions
  handleSelect: _react.PropTypes.func, // обработчик выбора значения в списке
  handleAdd: _react.PropTypes.func, // обработчик добавления объекта
  handleEdit: _react.PropTypes.func, // обработчик открытия формы редактора
  handleRevert: _react.PropTypes.func, // откатить изменения - перечитать объект из базы данных
  handleMarkDeleted: _react.PropTypes.func, // обработчик удаления строки
  handlePost: _react.PropTypes.func, // обработчик проведения документа
  handleUnPost: _react.PropTypes.func, // отмена проведения
  handlePrint: _react.PropTypes.func, // обработчик открытия диалога печати
  handleAttachment: _react.PropTypes.func };
DataList.defaultProps = {
  width: 1000,
  height: 400
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
    const { handleRemove, _mgr } = this.props;
    if (row && handleRemove) {
      handleRemove(row, _mgr);
    }
  };

  this.handleSchemeChange = scheme => {

    const { state, props, _list } = this;
    const { _mgr, params } = props;

    scheme.set_default().fix_select(state.select, params && params.options || _mgr.class_name);

    _list.clear();
    this.setState({
      scheme,
      columns: scheme.columns(),
      totalRowCount: 0,
      do_reload: true
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

  this._isRowLoaded = ({ index }) => {
    const res = !!this._list.get(index);
    return res;
  };

  this._loadMoreRows = ({ startIndex, stopIndex }) => {

    const { select, scheme, totalRowCount } = this.state;
    const { _mgr, params } = this.props;
    const increment = Math.max(limit, stopIndex - startIndex + 1);

    Object.assign(select, {
      _top: increment,
      _skip: startIndex,
      _view: 'doc/by_date',
      _raw: true
    });
    scheme.fix_select(select, params && params.options || _mgr.class_name);

    // выполняем запрос
    return _mgr.find_rows_remote(select).then(data => {

      // обновляем массив результата
      for (var i = 0; i < data.length; i++) {
        if (!this._list._data[i + startIndex]) {
          this._list._data[i + startIndex] = data[i];
        }
      }

      // обновляем состояние - изменилось количество записей
      if (totalRowCount != startIndex + data.length + (data.length < increment ? 0 : increment)) {
        this.setState({
          totalRowCount: startIndex + data.length + (data.length < increment ? 0 : increment)
        });
      } else {
        this.forceUpdate();
      }
    });
  };

  this._cellRenderer = ({ columnIndex, isScrolling, key, rowIndex, style }) => {

    const { state, props, _list, handleEdit, handleSelect } = this;
    const { hoveredColumnIndex, hoveredRowIndex, selectedRowIndex } = state;

    // оформление ячейки
    const classNames = (0, _classnames2.default)(this._getRowClassName(rowIndex), _DataList2.default.cell, {
      //[styles.centeredCell]: columnIndex > 3, // выравнивание текста по центру
      [_DataList2.default.hoveredItem]: rowIndex == hoveredRowIndex && rowIndex != selectedRowIndex, // || columnIndex === this.state.hoveredColumnIndex
      [_DataList2.default.selectedItem]: rowIndex == selectedRowIndex
    });

    // данные строки
    const row = _list.get(rowIndex);

    // текст ячейки
    const content = row ? this._formatter(row, columnIndex) : _react2.default.createElement("div", {
      className: _DataList2.default.placeholder,
      style: { width: 10 + Math.random() * 80 }
    });

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

    // It is important to attach the style specified as it controls the cell's position.
    // You can add additional class names or style properties as you would like.
    // Key is also required by React to more efficiently manage the array of cells.
    return _react2.default.createElement(
      "div",
      {
        className: classNames,
        key: key,
        style: style,
        onMouseOver: onMouseOver,
        onTouchTap: onTouchTap,
        onDoubleClick: props.selection_mode ? handleSelect : handleEdit,
        title: hoveredColumnIndex == columnIndex && hoveredRowIndex == rowIndex ? content : ''
      },
      content
    );
  };
};