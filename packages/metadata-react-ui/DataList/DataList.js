"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = require("react-virtualized");

var _Toolbar = require("./Toolbar");

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

var _DataList = require("./DataList.scss");

var _DataList2 = _interopRequireDefault(_DataList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var limit = 30,
    totalRows = 999999;

var DataList = function (_Component) {
  _inherits(DataList, _Component);

  function DataList(props, context) {
    _classCallCheck(this, DataList);

    var _this = _possibleConstructorReturn(this, (DataList.__proto__ || Object.getPrototypeOf(DataList)).call(this, props));

    _this.state = {
      totalRowCount: totalRows,
      selectedRowIndex: 0,
      columns: props.columns,
      _meta: props._meta || props._mgr.metadata(),

      // готовим фильтры для запроса couchdb
      select: props.select || {
        _view: 'doc/by_date',
        _raw: true,
        _top: 30,
        _skip: 0,
        _key: {
          startkey: [props._mgr.class_name, 2000],
          endkey: [props._mgr.class_name, 2020]
        }
      }
    };

    var state = _this.state;
    var $p = context.$p;


    if (!state.columns || !state.columns.length) {

      state.columns = [];

      // набираем поля
      if (state._meta.form && state._meta.form.selection) {
        state._meta.form.selection.cols.forEach(function (fld) {
          var fld_meta = state._meta.fields[fld.id] || props._mgr.metadata(fld.id);
          state.columns.push({
            id: fld.id,
            synonym: fld.caption || fld_meta.synonym,
            tooltip: fld_meta.tooltip,
            type: fld_meta.type,
            width: fld.width == '*' ? 250 : parseInt(fld.width) || 140
          });
        });
      } else {

        if (props._mgr instanceof $p.classes.CatManager) {
          if (state._meta.code_length) {
            state.columns.push('id');
          }

          if (state._meta.main_presentation_name) {
            state.columns.push('name');
          }
        } else if (props._mgr instanceof $p.classes.DocManager) {
          state.columns.push('number_doc');
          state.columns.push('date');
        }

        state.columns = state.columns.map(function (id, index) {
          // id, synonym, tooltip, type, width
          var fld_meta = state._meta.fields[id] || props._mgr.metadata(id);
          return {
            id: id,
            synonym: fld_meta.synonym,
            tooltip: fld_meta.tooltip,
            type: fld_meta.type,
            width: fld_meta.width || 140
          };
        });
      }
    }

    _this._list = {
      _data: [],
      get size() {
        return this._data.length;
      },
      get: function get(index) {
        return this._data[index];
      },
      clear: function clear() {
        this._data.length = 0;
      }
    };

    _this._isRowLoaded = _this._isRowLoaded.bind(_this);
    _this._loadMoreRows = _this._loadMoreRows.bind(_this);
    _this._cellRenderer = _this._cellRenderer.bind(_this);

    _this.handleEdit = _this.handleEdit.bind(_this);

    return _this;
  }

  _createClass(DataList, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _state = this.state,
          columns = _state.columns,
          totalRowCount = _state.totalRowCount;
      var _props = this.props,
          width = _props.width,
          height = _props.height;


      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_Toolbar2.default, {
          handleAdd: this.handleAdd,
          handleEdit: this.handleEdit,
          handleRemove: this.handleRemove,
          handleSelectionChange: this.handleSelectionChange,
          handlePrint: this.handlePrint,
          handleAttachment: this.handleAttachment,
          selectionValue: {}
        }),
        _react2.default.createElement(
          _reactVirtualized.InfiniteLoader,
          {
            isRowLoaded: this._isRowLoaded,
            loadMoreRows: this._loadMoreRows,
            rowCount: totalRowCount,
            minimumBatchSize: limit
          },
          function (_ref) {
            var onRowsRendered = _ref.onRowsRendered,
                registerChild = _ref.registerChild;


            var onSectionRendered = function onSectionRendered(_ref2) {
              var rowOverscanStartIndex = _ref2.rowOverscanStartIndex,
                  rowOverscanStopIndex = _ref2.rowOverscanStopIndex,
                  rowStartIndex = _ref2.rowStartIndex,
                  rowStopIndex = _ref2.rowStopIndex;


              onRowsRendered({
                overscanStartIndex: rowOverscanStartIndex,
                overscanStopIndex: rowOverscanStopIndex,
                startIndex: rowStartIndex,
                stopIndex: rowStopIndex
              });
            };

            var left = 0;

            return _react2.default.createElement(
              "div",
              null,
              _react2.default.createElement(
                "div",
                {
                  //className={styles.BodyGrid}
                  style: { position: 'relative' } },
                columns.map(function (column, index) {

                  var res = _react2.default.createElement(
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
                cellRenderer: _this2._cellRenderer,
                columnCount: columns.length,
                columnWidth: function columnWidth(_ref3) {
                  var index = _ref3.index;
                  return columns[index].width;
                },
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
  }, {
    key: "handleAdd",
    value: function handleAdd(e) {
      var _props2 = this.props,
          handleAdd = _props2.handleAdd,
          _mgr = _props2._mgr;

      if (handleAdd) {
        handleAdd(_mgr);
      }
    }
  }, {
    key: "handleEdit",
    value: function handleEdit(e) {
      var row = this._list.get(this.state.selectedRowIndex);
      var _props3 = this.props,
          handleEdit = _props3.handleEdit,
          _mgr = _props3._mgr;

      if (row && handleEdit) {
        handleEdit(row, _mgr);
      }
    }
  }, {
    key: "handleRemove",
    value: function handleRemove(e) {
      var row = this._list.get(this.state.selectedRowIndex);
      var _props4 = this.props,
          handleRemove = _props4.handleRemove,
          _mgr = _props4._mgr;

      if (row && handleRemove) {
        handleRemove(row, _mgr);
      }
    }
  }, {
    key: "handleSelectionChange",
    value: function handleSelectionChange(e) {
      var row = this._list.get(this.state.selectedRowIndex);
      var _props5 = this.props,
          handleSelectionChange = _props5.handleSelectionChange,
          _mgr = _props5._mgr;

      if (row && handleSelectionChange) {
        handleSelectionChange(row, _mgr);
      }
    }
  }, {
    key: "handlePrint",
    value: function handlePrint(e) {
      var row = this._list.get(this.state.selectedRowIndex);
      var _props6 = this.props,
          handlePrint = _props6.handlePrint,
          _mgr = _props6._mgr;

      if (row && handlePrint) {
        handlePrint(row, _mgr);
      }
    }
  }, {
    key: "handleAttachment",
    value: function handleAttachment(e) {
      var row = this._list.get(this.state.selectedRowIndex);
      var _props7 = this.props,
          handleAttachment = _props7.handleAttachment,
          _mgr = _props7._mgr;

      if (row && handleAttachment) {
        handleAttachment(row, _mgr);
      }
    }
  }, {
    key: "_formatter",
    value: function _formatter(row, index) {
      var $p = this.context.$p;
      var columns = this.state.columns;

      var column = columns[index];
      var v = row[column.id];

      switch ($p.UI.control_by_type(column.type, v)) {

        case 'ocombo':
          return $p.utils.value_mgr(row, column.id, column.type, false, v).get(v).presentation;

        case 'dhxCalendar':
          return $p.utils.moment(v).format($p.utils.moment._masks.date);

        default:
          return v;

      }
    }
  }, {
    key: "_isRowLoaded",
    value: function _isRowLoaded(_ref4) {
      var index = _ref4.index;

      var res = !!this._list.get(index);
      return res;
    }
  }, {
    key: "_getRowClassName",
    value: function _getRowClassName(row) {
      return row % 2 === 0 ? _DataList2.default.evenRow : _DataList2.default.oddRow;
    }
  }, {
    key: "_loadMoreRows",
    value: function _loadMoreRows(_ref5) {
      var _this3 = this;

      var startIndex = _ref5.startIndex,
          stopIndex = _ref5.stopIndex;
      var _state2 = this.state,
          select = _state2.select,
          totalRowCount = _state2.totalRowCount;
      var _mgr = this.props._mgr;

      var increment = Math.max(limit, stopIndex - startIndex + 1);

      select._top = increment;
      select._skip = startIndex;

      // выполняем запрос
      return _mgr.find_rows_remote(select).then(function (data) {

        // обновляем массив результата
        for (var i = 0; i < data.length; i++) {
          if (!_this3._list._data[i + startIndex]) {
            _this3._list._data[i + startIndex] = data[i];
          }
        }

        // обновляем состояние - изменилось количество записей
        if (totalRowCount != startIndex + data.length + (data.length < increment ? 0 : increment)) {
          _this3.setState({
            totalRowCount: startIndex + data.length + (data.length < increment ? 0 : increment)
          });
        } else {
          _this3.forceUpdate();
        }
      });
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

  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref6) {
      var _cn;

      var columnIndex = _ref6.columnIndex,
          isScrolling = _ref6.isScrolling,
          key = _ref6.key,
          rowIndex = _ref6.rowIndex,
          style = _ref6.style;
      var $p = this.context.$p;

      var setState = this.setState.bind(this);
      // var grid = this.refs.AutoSizer.refs.Grid

      var classNames = (0, _classnames2.default)(this._getRowClassName(rowIndex), _DataList2.default.cell, (_cn = {}, _defineProperty(_cn, _DataList2.default.centeredCell, columnIndex > 3), _defineProperty(_cn, _DataList2.default.hoveredItem, rowIndex === this.state.hoveredRowIndex && rowIndex != this.state.selectedRowIndex), _defineProperty(_cn, _DataList2.default.selectedItem, rowIndex === this.state.selectedRowIndex), _cn));

      var row = this._list.get(rowIndex);

      var content = void 0;

      if (row) {
        content = this._formatter(row, columnIndex);
      } else {
        content = _react2.default.createElement("div", {
          className: _DataList2.default.placeholder,
          style: { width: 10 + Math.random() * 80 }
        });
      }

      // It is important to attach the style specified as it controls the cell's position.
      // You can add additional class names or style properties as you would like.
      // Key is also required by React to more efficiently manage the array of cells.
      return _react2.default.createElement(
        "div",
        {
          className: classNames,
          key: key,
          style: style,
          onMouseOver: function onMouseOver() {
            setState({
              hoveredColumnIndex: columnIndex,
              hoveredRowIndex: rowIndex
            });
          },
          onTouchTap: function onTouchTap() {
            setState({
              selectedRowIndex: rowIndex
            });
          },
          onDoubleClick: this.handleEdit
        },
        content
      );
    }
  }]);

  return DataList;
}(_react.Component);

DataList.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
DataList.propTypes = {

  columns: _react.PropTypes.array, // Настройки колонок динамического списка. Если не указано - генерируем по метаданным
  selection_mode: _react.PropTypes.bool, // Режим выбора из списка. Если истина - дополнительно рисум кнопку выбора

  select: _react.PropTypes.object, // Параметры запроса к couchdb. Если не указано - генерируем по метаданным
  _mgr: _react.PropTypes.object.isRequired, // Менеджер данных
  _meta: _react.PropTypes.object, // Описание метаданных. Если не указано, используем метаданные менеджера

  width: _react.PropTypes.number.isRequired, // ширина элемента управления - вычисляется родительским компонентом с помощью `react-virtualized/AutoSizer`
  height: _react.PropTypes.number.isRequired, // высота элемента управления - вычисляется родительским компонентом с помощью `react-virtualized/AutoSizer`

  // Redux actions
  // Не факт, что все обработчики должны быть isRequired...
  handleAdd: _react.PropTypes.func.isRequired, // обработчик добавления объекта
  handleEdit: _react.PropTypes.func.isRequired, // обработчик открытия формы редактора
  handleRevert: _react.PropTypes.func.isRequired, // откатить изменения - перечитать объект из базы данных
  handleMarkDeleted: _react.PropTypes.func.isRequired, // обработчик удаления строки
  handlePost: _react.PropTypes.func.isRequired, // обработчик проведения документа
  handleUnPost: _react.PropTypes.func.isRequired, // отмена проведения
  handlePrint: _react.PropTypes.func.isRequired, // обработчик открытия диалога печати
  handleAttachment: _react.PropTypes.func.isRequired };
DataList.defaultProps = {
  width: 1000,
  height: 400
};
exports.default = DataList;