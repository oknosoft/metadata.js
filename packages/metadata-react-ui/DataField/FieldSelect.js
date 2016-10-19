'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DataField = require('./DataField.scss');

var _DataField2 = _interopRequireDefault(_DataField);

var _reactVirtualizedSelect = require('react-virtualized-select');

var _reactVirtualizedSelect2 = _interopRequireDefault(_reactVirtualizedSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldSelect = function (_Component) {
  (0, _inherits3.default)(FieldSelect, _Component);

  function FieldSelect(props) {
    (0, _classCallCheck3.default)(this, FieldSelect);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FieldSelect.__proto__ || (0, _getPrototypeOf2.default)(FieldSelect)).call(this, props));

    _this.state = {
      clearable: true,
      disabled: false,
      githubUsers: [],
      multi: false,
      searchable: true,
      selectedCreatable: null
    };

    _this._loadGithubUsers = _this._loadGithubUsers.bind(_this);

    return _this;
  }

  (0, _createClass3.default)(FieldSelect, [{
    key: '_goToGithubUser',
    value: function _goToGithubUser(value) {
      window.open(value.html_url);
    }
  }, {
    key: '_loadGithubUsers',
    value: function _loadGithubUsers(input) {
      var _this2 = this;

      return this.props._obj[this.props._fld]._manager.get_option_list({
        presentation: { like: input }
      }).then(function (githubUsers) {
        _this2.setState({ githubUsers: githubUsers });

        return { options: githubUsers };
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        { className: _DataField2.default.field },
        _react2.default.createElement(
          'div',
          { className: _DataField2.default.label },
          this.props._meta.synonym
        ),
        _react2.default.createElement(
          'div',
          { className: _DataField2.default.dataselect },
          _react2.default.createElement(_reactVirtualizedSelect2.default, {
            name: this.props._meta.name,
            async: true,
            backspaceRemoves: false,
            labelKey: 'presentation',
            valueKey: 'ref',
            loadOptions: this._loadGithubUsers,
            minimumInput: 0,
            onChange: function onChange(selectedGithubUser) {
              return _this3.setState({ selectedGithubUser: selectedGithubUser });
            },
            onValueClick: this._goToGithubUser,
            options: this.state.githubUsers,
            value: this.state.selectedGithubUser

          })
        )
      );
    }
  }]);
  return FieldSelect;
}(_react.Component);

exports.default = FieldSelect;
process.env.NODE_ENV !== "production" ? FieldSelect.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object,
  handleValueChange: _react.PropTypes.func
} : void 0;