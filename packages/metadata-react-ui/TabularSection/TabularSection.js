'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDataGrid = require('react-data-grid');

var _reactDataGrid2 = _interopRequireDefault(_reactDataGrid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabularSection = function (_Component) {
  _inherits(TabularSection, _Component);

  function TabularSection(props, context) {
    _classCallCheck(this, TabularSection);

    var _this = _possibleConstructorReturn(this, (TabularSection.__proto__ || Object.getPrototypeOf(TabularSection)).call(this, props));

    var users_mgr = context.$p.cat.users;

    _this.state = {
      _meta: props._meta || props._obj._metadata(props._tabular),
      _tabular: props._obj[props._tabular],
      _columns: [{
        key: 'row',
        name: '№',
        resizable: true,
        width: 80
      }, {
        key: 'individual_person',
        name: 'ФИО',
        resizable: true,
        formatter: function formatter(v) {
          v = users_mgr.get(v.value);
          return _react2.default.createElement(
            'div',
            null,
            v instanceof Promise ? 'loading...' : v.presentation
          );
        }
      }]
    };
    return _this;
  }

  _createClass(TabularSection, [{
    key: 'rowGetter',
    value: function rowGetter(i) {
      return this.state._tabular.get(i)._obj;
    }
  }, {
    key: 'render',
    value: function render() {
      var $p = this.context.$p;
      var _state = this.state,
          _meta = _state._meta,
          _tabular = _state._tabular,
          _columns = _state._columns;

      var _val = this.props._obj[this.props._fld];
      var subProps = {
        _meta: this.state._meta,
        _obj: this.props._obj,
        _fld: this.props._fld,
        _val: _val
      };

      return _react2.default.createElement(_reactDataGrid2.default, {
        columns: _columns,
        rowGetter: this.rowGetter.bind(this),
        rowsCount: _tabular.count(),
        minHeight: 140 });
    }
  }]);

  return TabularSection;
}(_react.Component);

TabularSection.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};
TabularSection.propTypes = {

  _obj: _react.PropTypes.object.isRequired,
  _tabular: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object,

  handleValueChange: _react.PropTypes.func,
  handleRowChange: _react.PropTypes.func
};
exports.default = TabularSection;