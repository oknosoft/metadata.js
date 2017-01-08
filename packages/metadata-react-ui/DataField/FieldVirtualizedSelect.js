"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Import directly to avoid Webpack bundling the parts of react-virtualized that we are not using


var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require("react-select");

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _reactVirtualized = require("react-virtualized");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class VirtualizedSelect extends _react.Component {

  constructor(props, context) {
    super(props, context);

    this._renderMenu = this._renderMenu.bind(this);
    this._optionRenderer = this._optionRenderer.bind(this);
  }

  /** See List#recomputeRowHeights */
  recomputeOptionHeights(index = 0) {
    if (this._virtualScroll) {
      this._virtualScroll.recomputeRowHeights(index);
    }
  }

  render() {
    const SelectComponent = this._getSelectComponent();

    return _react2.default.createElement(SelectComponent, _extends({}, this.props, {
      menuRenderer: this._renderMenu,
      menuStyle: { overflow: 'hidden' }
    }));
  }

  // See https://github.com/JedWatson/react-select/#effeciently-rendering-large-lists-with-windowing
  _renderMenu({ focusedOption, focusOption, labelKey, onSelect, options, selectValue, valueArray }) {
    const { listProps, optionRenderer } = this.props;
    const focusedOptionIndex = options.indexOf(focusedOption);
    const height = this._calculateListHeight({ options });
    const innerRowRenderer = optionRenderer || this._optionRenderer;

    // react-select 1.0.0-rc2 passes duplicate `onSelect` and `selectValue` props to `menuRenderer`
    // The `Creatable` HOC only overrides `onSelect` which breaks an edge-case
    // In order to support creating items via clicking on the placeholder option,
    // We need to ensure that the specified `onSelect` handle is the one we use.
    // See issue #33

    function wrappedRowRenderer({ index, key, style }) {
      const option = options[index];

      return innerRowRenderer({
        focusedOption,
        focusedOptionIndex,
        focusOption,
        key,
        labelKey,
        onSelect,
        option,
        optionIndex: index,
        options,
        selectValue: onSelect,
        style,
        valueArray
      });
    }

    return _react2.default.createElement(
      _reactVirtualized.AutoSizer,
      { disableHeight: true },
      ({ width }) => _react2.default.createElement(_reactVirtualized.List, _extends({
        className: "VirtualSelectGrid",
        height: height,
        ref: ref => this._virtualScroll = ref,
        rowCount: options.length,
        rowHeight: ({ index }) => this._getOptionHeight({
          option: options[index]
        }),
        rowRenderer: wrappedRowRenderer,
        scrollToIndex: focusedOptionIndex,
        width: width
      }, listProps))
    );
  }

  _calculateListHeight({ options }) {
    const { maxHeight } = this.props;

    let height = 0;

    for (let optionIndex = 0; optionIndex < options.length; optionIndex++) {
      let option = options[optionIndex];

      height += this._getOptionHeight({ option });

      if (height > maxHeight) {
        return maxHeight;
      }
    }

    return height;
  }

  _getOptionHeight({ option }) {
    const { optionHeight } = this.props;

    return optionHeight instanceof Function ? optionHeight({ option }) : optionHeight;
  }

  _getSelectComponent() {
    const { async, selectComponent } = this.props;

    if (selectComponent) {
      return selectComponent;
    } else if (async) {
      return _reactSelect2.default.Async;
    } else {
      return _reactSelect2.default;
    }
  }

  _optionRenderer({ focusedOption, focusOption, key, labelKey, option, selectValue, style }) {
    const className = ['VirtualizedSelectOption'];

    if (option === focusedOption) {
      className.push('VirtualizedSelectFocusedOption');
    }

    if (option.disabled) {
      className.push('VirtualizedSelectDisabledOption');
    }

    const events = option.disabled ? {} : {
      onClick: () => selectValue(option),
      onMouseOver: () => focusOption(option)
    };

    return _react2.default.createElement(
      "div",
      _extends({
        className: className.join(' '),
        key: key,
        style: style
      }, events),
      option[labelKey]
    );
  }
}
exports.default = VirtualizedSelect;
VirtualizedSelect.propTypes = {
  async: _react.PropTypes.bool,
  listProps: _react.PropTypes.object,
  maxHeight: _react.PropTypes.number.isRequired,
  optionHeight: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.func]).isRequired,
  optionRenderer: _react.PropTypes.func,
  selectComponent: _react.PropTypes.func
};
VirtualizedSelect.defaultProps = {
  async: false,
  maxHeight: 200,
  optionHeight: 35
};