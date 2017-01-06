"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _FieldVirtualizedSelect = require("./FieldVirtualizedSelect");

var _FieldVirtualizedSelect2 = _interopRequireDefault(_FieldVirtualizedSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FieldSelect extends _react.Component {

  constructor(props) {

    super(props);

    this._loadOptions = input => {

      const selection = { _top: 40 };
      const { _obj, _fld, _meta } = this.props;

      if (input) {
        selection.presentation = { like: input };
      }
      if (_meta.choice_params) {
        _meta.choice_params.forEach(cp => {
          selection[cp.name] = cp.path;
        });
      }

      return _obj[_fld]._manager.get_option_list(selection).then(options => {

        this.setState({ options });

        return { options };
      });
    };

    this._onChange = value => {
      this.setState({ value });
      if (this.props.handleValueChange) this.props.handleValueChange(value);
    };

    this.state = {
      clearable: true,
      disabled: false,
      options: [],
      multi: props.multi || false,
      searchable: true,
      selectedCreatable: null
    };
  }

  render() {

    return _react2.default.createElement(_FieldVirtualizedSelect2.default, {
      name: this.props._fld,
      async: true,
      cache: false,
      backspaceRemoves: false,
      labelKey: "presentation",
      valueKey: "ref",
      loadOptions: this._loadOptions,
      minimumInput: 0,
      onChange: this._onChange
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

  multi: _react.PropTypes.bool,

  handleValueChange: _react.PropTypes.func
};