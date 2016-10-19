"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = require("react-virtualized");

var _Toolbar = require("./Toolbar");

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _DataList = require("./DataList.scss");

var _DataList2 = _interopRequireDefault(_DataList);

var _classnames = require("classnames");

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var limit = 30,
    totalRows = 999999;

var DataList = function (_Component) {
  (0, _inherits3.default)(DataList, _Component);

  function DataList(props) {
    (0, _classCallCheck3.default)(this, DataList);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DataList.__proto__ || (0, _getPrototypeOf2.default)(DataList)).call(this, props));

    _this.state = {
      totalRowCount: totalRows,
      selectedRowIndex: 0
    };

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

  (0, _createClass3.default)(DataList, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var totalRowCount = this.state.totalRowCount;
      var _props = this.props;
      var columns = _props.columns;
      var _width = _props._width;
      var _height = _props._height;


      return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(_Toolbar2.default, {
          handleAdd: this.props.handleAdd,
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
            var onRowsRendered = _ref.onRowsRendered;
            var registerChild = _ref.registerChild;


            var onSectionRendered = function onSectionRendered(_ref2) {
              var rowOverscanStartIndex = _ref2.rowOverscanStartIndex;
              var rowOverscanStopIndex = _ref2.rowOverscanStopIndex;
              var rowStartIndex = _ref2.rowStartIndex;
              var rowStopIndex = _ref2.rowStopIndex;


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
                width: _width,
                height: _height - 140,
                style: { top: 30 }
              })
            );
          }
        )
      );
    }
  }, {
    key: "handleAdd",
    value: function handleAdd(e) {}
  }, {
    key: "handleEdit",
    value: function handleEdit(e) {
      var row = this._list.get(this.state.selectedRowIndex);
      if (row) this.props.handleEdit(row);
    }
  }, {
    key: "handleRemove",
    value: function handleRemove(e) {}
  }, {
    key: "handleSelectionChange",
    value: function handleSelectionChange(e) {}
  }, {
    key: "handlePrint",
    value: function handlePrint(e) {}
  }, {
    key: "handleAttachment",
    value: function handleAttachment(e) {}
  }, {
    key: "_formatter",
    value: function _formatter(row, index) {
      var $p = this.context.$p;
      var columns = this.props.columns;

      var column = columns[index];
      var v = row[column.id];

      switch ($p.rx_control_by_type(column.type, v)) {

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

      var startIndex = _ref5.startIndex;
      var stopIndex = _ref5.stopIndex;
      var totalRowCount = this.state.totalRowCount;
      var _props2 = this.props;
      var select = _props2.select;
      var _mgr = _props2._mgr;

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
     * @return {XML}
     * @private
     */

  }, {
    key: "_cellRenderer",
    value: function _cellRenderer(_ref6) {
      var _cn;

      var columnIndex = _ref6.columnIndex;
      var isScrolling = _ref6.isScrolling;
      var key = _ref6.key;
      var rowIndex = _ref6.rowIndex;
      var style = _ref6.style;
      var $p = this.context.$p;

      var setState = this.setState.bind(this);
      // var grid = this.refs.AutoSizer.refs.Grid

      var classNames = (0, _classnames2.default)(this._getRowClassName(rowIndex), _DataList2.default.cell, (_cn = {}, (0, _defineProperty3.default)(_cn, _DataList2.default.centeredCell, columnIndex > 3), (0, _defineProperty3.default)(_cn, _DataList2.default.hoveredItem, rowIndex === this.state.hoveredRowIndex && rowIndex != this.state.selectedRowIndex), (0, _defineProperty3.default)(_cn, _DataList2.default.selectedItem, rowIndex === this.state.selectedRowIndex), _cn));

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
exports.default = DataList;
process.env.NODE_ENV !== "production" ? DataList.propTypes = {

  columns: _react.PropTypes.array.isRequired,

  select: _react.PropTypes.object.isRequired,
  _mgr: _react.PropTypes.object.isRequired,
  _width: _react.PropTypes.number.isRequired,
  _height: _react.PropTypes.number.isRequired
} : void 0;