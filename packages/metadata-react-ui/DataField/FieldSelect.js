"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactVirtualizedSelect = require("react-virtualized-select");

var _reactVirtualizedSelect2 = _interopRequireDefault(_reactVirtualizedSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FieldSelect extends _react.Component {

  constructor(props) {
    super(props);

    this.state = {
      clearable: true,
      disabled: false,
      options: [],
      multi: false,
      searchable: true,
      selectedCreatable: null
    };
  }

  _goToGithubUser(value) {
    window.open(value.html_url);
  }

  _loadOptions(input) {

    const selection = { _top: 40 };
    if (input) {
      selection.presentation = { like: input };
    }
    if (this.props._meta.choice_params) {
      this.props._meta.choice_params.forEach(function (cp) {
        selection[cp.name] = cp.path;
      });
    }

    return this.props._obj[this.props._fld]._manager.get_option_list(selection).then(options => {
      this.setState({ options });

      return { options: options };
    });
  }

  _onChange(value) {
    this.setState({ value });
    if (this.props.handleValueChange) this.props.handleValueChange(value);
  }

  render() {

    return _react2.default.createElement(_reactVirtualizedSelect2.default, {
      name: this.props._fld,
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

    });
  }
}
exports.default = FieldSelect;
FieldSelect.propTypes = {
  _obj: _react.PropTypes.object.isRequired,
  _fld: _react.PropTypes.string.isRequired,
  _meta: _react.PropTypes.object,

  handleValueChange: _react.PropTypes.func
};