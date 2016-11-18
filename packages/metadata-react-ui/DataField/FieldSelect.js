"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _DataField = require("./DataField.scss");

var _DataField2 = _interopRequireDefault(_DataField);

var _reactVirtualizedSelect = require("react-virtualized-select");

var _reactVirtualizedSelect2 = _interopRequireDefault(_reactVirtualizedSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldSelect = function (_Component) {
  _inherits(FieldSelect, _Component);

  function FieldSelect(props) {
    _classCallCheck(this, FieldSelect);

    var _this = _possibleConstructorReturn(this, (FieldSelect.__proto__ || Object.getPrototypeOf(FieldSelect)).call(this, props));

    _this.state = {
      clearable: true,
      disabled: false,
      options: [],
      multi: false,
      searchable: true,
      selectedCreatable: null
    };
    return _this;
  }

  _createClass(FieldSelect, [{
    key: "_goToGithubUser",
    value: function _goToGithubUser(value) {
      window.open(value.html_url);
    }
  }, {
    key: "_loadOptions",
    value: function _loadOptions(input) {
      var _this2 = this;

      var selection = { _top: 40 };
      if (input) {
        selection.presentation = { like: input };
      }
      if (this.props._meta.choice_params) {
        this.props._meta.choice_params.forEach(function (cp) {
          selection[cp.name] = cp.path;
        });
      }

      return this.props._obj[this.props._fld]._manager.get_option_list(selection).then(function (options) {
        _this2.setState({ options: options });

        return { options: options };
      });
    }
  }, {
    key: "_onChange",
    value: function _onChange(value) {
      this.setState({ value: value });
      if (this.props.handleValueChange) this.props.handleValueChange(value);
    }
  }, {
    key: "render",
    value: function render() {

      return this.props._hide_label ? _react2.default.createElement(_reactVirtualizedSelect2.default, {
        name: this.props._meta.name,
        async: true,
        backspaceRemoves: false,
        labelKey: "presentation",
        valueKey: "ref",
        loadOptions: this._loadOptions.bind(this),
        minimumInput: 0,
        onChange: this._onChange.bind(this)
        //onValueClick={this._goToGithubUser}
        , options: this.state.options,
        value: this.state.value

      }) : _react2.default.createElement(
        "div",
        { className: _DataField2.default.field },
        _react2.default.createElement(
          "div",
          { className: _DataField2.default.label },
          this.props._meta.synonym
        ),
        _react2.default.createElement(
          "div",
          { className: _DataField2.default.dataselect },
          _react2.default.createElement(_reactVirtualizedSelect2.default, {
            name: this.props._meta.name,
            async: true,
            backspaceRemoves: false,
            labelKey: "presentation",
            valueKey: "ref",
            loadOptions: this._loadOptions.bind(this),
            minimumInput: 0,
            onChange: this._onChange.bind(this)
            //onValueClick={this._goToGithubUser}
            , options: this.state.options,
            value: this.state.value

          })
        )
      );
    }
  }]);

  return FieldSelect;
}(_react.Component);

FieldSelect.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object,
  _hide_label: _react.PropTypes.bool,
  handleValueChange: _react.PropTypes.func
};
exports.default = FieldSelect;