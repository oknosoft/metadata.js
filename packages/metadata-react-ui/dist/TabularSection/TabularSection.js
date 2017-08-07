"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDataGrid = require("react-data-grid");

var _reactDataGrid2 = _interopRequireDefault(_reactDataGrid);

var _DumbLoader = require("../DumbLoader");

var _DumbLoader2 = _interopRequireDefault(_DumbLoader);

var _DataCell = require("../DataField/DataCell");

var _DataCell2 = _interopRequireDefault(_DataCell);

var _TabularSectionToolbar = require("./TabularSectionToolbar");

var _TabularSectionToolbar2 = _interopRequireDefault(_TabularSectionToolbar);

var _reactVirtualized = require("react-virtualized");

var _TabularSection = require("./TabularSection.scss");

var _TabularSection2 = _interopRequireDefault(_TabularSection);

var _DataField = require("../DataField");

var _SimpleLoadingMessage = require("../SimpleLoadingMessage");

var _SimpleLoadingMessage2 = _interopRequireDefault(_SimpleLoadingMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class TabularSection extends _react.Component {

  constructor(props, context) {
    super(props, context);

    _initialiseProps.call(this);

    const { $p } = context;
    const { _obj } = props;
    const class_name = _obj._manager.class_name + "." + props._tabular;

    this.state = {
      _meta: props._meta || _obj._metadata(props._tabular),
      _tabular: _obj[props._tabular],
      _columns: props._columns || [],
      Toolbar: props.Toolbar || _TabularSectionToolbar2.default,
      selectedIds: props.rowSelection ? props.rowSelection.selectBy.keys.values : []
    };

    if (!this.state._columns.length) {
      $p.cat.scheme_settings.get_scheme(class_name).then(this.handleSchemeChange);
    }
  }

  handleRowUpdated(e) {
    //merge updated row with current row and rerender by setting state
    var row = this.rowGetter(e.rowIdx);
    Object.assign(row._row || row, e.updated);
  }

  // обработчик при изменении настроек компоновки


  render() {
    const { props, state, context, rowGetter, onRowsSelected, onRowsDeselected, handleAdd, handleRemove, handleUp, handleDown, handleRowUpdated } = this;
    const { _meta, _tabular, _columns, scheme, selectedIds, Toolbar } = state;
    const { _obj, rowSelection, deny_add_del, deny_reorder, minHeight, handleCustom } = props;

    if (!_columns || !_columns.length) {
      if (!scheme) {
        return _react2.default.createElement(_SimpleLoadingMessage2.default, { text: "\u0427\u0442\u0435\u043D\u0438\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
      }

      return _react2.default.createElement(_SimpleLoadingMessage2.default, { text: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A \u043A\u043E\u043C\u043F\u043E\u043D\u043E\u0432\u043A\u0438..." });
    }

    // contextMenu={<MyContextMenu
    //   onRowDelete={this.handleRemove}
    //   onRowAdd={this.handleAdd}
    //   style={{zIndex: 9999}}
    // />}

    // <SettingsProductionToolbar
    //   handleAdd={}
    //   handleRemove={}
    // />

    if (rowSelection) {
      rowSelection.onRowsSelected = onRowsSelected;
      rowSelection.onRowsDeselected = onRowsDeselected;
      rowSelection.selectBy.keys.values = selectedIds;
    }

    return _react2.default.createElement(
      "div",
      { className: "content-with-toolbar-layout" },
      _react2.default.createElement(
        "div",
        { className: "content-with-toolbar-layout__toolbar" },
        _react2.default.createElement(Toolbar, {
          handleAdd: handleAdd,
          handleRemove: handleRemove,
          handleUp: handleUp,
          handleDown: handleDown,
          handleCustom: handleCustom,
          deny_add_del: deny_add_del,
          deny_reorder: deny_reorder,
          scheme: scheme })
      ),
      _react2.default.createElement(
        "div",
        { className: "content-with-toolbar-layout__content" },
        _react2.default.createElement(
          _reactVirtualized.AutoSizer,
          null,
          ({ width, height }) => _react2.default.createElement(_reactDataGrid2.default, {
            minWidth: width,
            minHeight: height,

            ref: "grid",
            columns: _columns,
            enableCellSelect: true,
            rowGetter: rowGetter,
            rowsCount: _tabular.count(),
            onRowUpdated: handleRowUpdated,
            rowSelection: rowSelection })
        )
      )
    );
  }
}
exports.default = TabularSection;
TabularSection.propTypes = {
  _obj: _propTypes2.default.object.isRequired,
  _tabular: _propTypes2.default.string.isRequired,
  _meta: _propTypes2.default.object,
  _columns: _propTypes2.default.array,

  read_only: _propTypes2.default.bool, // Элемент только для чтения
  deny_add_del: _propTypes2.default.bool, // Запрет добавления и удаления строк (скрывает кнопки в панели, отключает обработчики)
  deny_reorder: _propTypes2.default.bool, // Запрет изменения порядка строк
  minHeight: _propTypes2.default.number,

  Toolbar: _propTypes2.default.func, // Конструктор индивидуальной панели инструментов. Если не указан, рисуем типовую

  handleValueChange: _propTypes2.default.func, // Обработчик изменения значения в ячейке
  handleRowChange: _propTypes2.default.func, // При окончании редактирования строки
  handleCustom: _propTypes2.default.func, // Внешний дополнительный подключаемый обработчик

  rowSelection: _propTypes2.default.object, // Настройка пометок строк

  selectedIds: _propTypes2.default.array
};
TabularSection.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
TabularSection.defaultProps = {
  deny_add_del: false,
  read_only: false
};

var _initialiseProps = function () {
  this.rowGetter = i => {
    const rowData = this.state._tabular.get(i);
    const fields = this.state._meta.fields;
    const row = new Map();

    let rowObject = null;
    if (this.state._tabular._obj.length > 0) {
      rowObject = this.state._tabular._obj[0];
    }

    for (const fieldName in fields) {
      if (fields.hasOwnProperty(fieldName) === false) {
        continue;
      }
      const field = fields[fieldName];

      // Create DataField for current cell.
      const dataFieldClassName = _DataField.DataFieldFactory.getClassNameForType(field.type);
      row.set(fieldName, _DataField.DataFieldFactory.create(dataFieldClassName, {
        _obj: rowObject,
        _fld: fieldName,
        _meta: this.state._meta
      }));
    }

    return row;
  };

  this.handleRemove = (e, data) => {
    if (!data) {
      data = this.refs.grid.state.selected;
    }
    this.state._tabular.del(data.rowIdx);
    this.forceUpdate();
  };

  this.handleAdd = (e, data) => {
    this.state._tabular.add();
    this.forceUpdate();
  };

  this.handleUp = () => {
    const data = this.refs.grid.state.selected;
    if (data && data.hasOwnProperty("rowIdx") && data.rowIdx > 0) {
      this.state._tabular.swap(data.rowIdx, data.rowIdx - 1);
      data.rowIdx = data.rowIdx - 1;
      this.forceUpdate();
    }
  };

  this.handleDown = () => {
    const data = this.refs.grid.state.selected;
    if (data && data.hasOwnProperty("rowIdx") && data.rowIdx < this.state._tabular.count() - 1) {
      this.state._tabular.swap(data.rowIdx, data.rowIdx + 1);
      data.rowIdx = data.rowIdx + 1;
      this.forceUpdate();
    }
  };

  this.handleSchemeChange = scheme => {

    const { props, state } = this;
    const _columns = scheme.rx_columns({
      mode: "ts",
      fields: state._meta.fields,
      _obj: props._obj
    });

    this.setState({ scheme, _columns });
  };

  this.onRowsSelected = rows => {
    const { rowSelection } = this.props;
    this.setState({
      selectedIds: this.state.selectedIds.concat(rows.map(r => {
        if (rowSelection.selectBy.keys.markKey) {
          r.row[rowSelection.selectBy.keys.markKey] = true;
        }
        return r.row[rowSelection.selectBy.keys.rowKey];
      }))
    });
  };

  this.onRowsDeselected = rows => {
    const { rowSelection } = this.props;
    let rowIds = rows.map(r => {
      if (rowSelection.selectBy.keys.markKey) {
        r.row[rowSelection.selectBy.keys.markKey] = false;
      }
      return r.row[rowSelection.selectBy.keys.rowKey];
    });
    this.setState({
      selectedIds: this.state.selectedIds.filter(i => rowIds.indexOf(i) === -1)
    });
  };
};