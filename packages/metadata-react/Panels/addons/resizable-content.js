
/* Based in react-component-resizable by Nicholas Rakoto
 The MIT License (MIT) https://github.com/nrako/react-component-resizable
 Copyright (c) 2014 Nicholas Rakoto
 */
var ResizableContent = React.createClass({
  displayName: 'ResizableContent',
  mixins: [Mixins.Content],

  lastDimensions: {
    width: null,
    height: null
  },

  propTypes: {
    triggersClass: PropTypes.string,
    expandClass: PropTypes.string,
    contractClass: PropTypes.string,
    onResize: PropTypes.func.isRequired
  },

  getDefaultProps: function () {
    return {
      triggersClass: 'resize-triggers',
      expandClass: 'expand-trigger',
      contractClass: 'contract-trigger'
    };
  },

  requestFrame: function (fn) {
    return (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn){ return window.setTimeout(fn, 20); })(fn);
  },

  cancelFrame: function (id) {
    return (window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout)(id);
  },

  componentDidMount: function () {
    this.resetTriggers();
    this.initialResetTriggersTimeout = setTimeout(this.resetTriggers, 1000);
  },

  componentWillUnmount: function () {
    clearTimeout(this.initialResetTriggersTimeout);
  },

  componentDidUpdate: function () {
    this.resetTriggers();
  },

  resetTriggers: function () {
    var contract = this.refs.contract.getDOMNode();
    var expandChild = this.refs.expandChild.getDOMNode();
    var expand = this.refs.expand.getDOMNode();

    contract.scrollLeft      = contract.scrollWidth;
    contract.scrollTop       = contract.scrollHeight;
    expandChild.style.width  = expand.offsetWidth + 1 + 'px';
    expandChild.style.height = expand.offsetHeight + 1 + 'px';
    expand.scrollLeft        = expand.scrollWidth;
    expand.scrollTop         = expand.scrollHeight;
  },

  onScroll: function () {
    if (this.r) this.cancelFrame(this.r);
    this.r = this.requestFrame(function () {
      var dimensions = this.getDimensions();

      if (this.haveDimensionsChanged(dimensions)) {
        this.lastDimensions = dimensions;
        this.props.onResize(dimensions);
      }
    }.bind(this));
  },

  getDimensions: function () {
    var el = {};
    if ((this.refs.resizable || false) && typeof this.refs.resizable.getDOMNode === "function") {
      el = this.refs.resizable.getDOMNode();
    }

    return {
      width: el.offsetWidth || 0,
      height: el.offsetHeight || 0
    };
  },

  haveDimensionsChanged: function (dimensions) {
    return dimensions.width != this.lastDimensions.width || dimensions.height != this.lastDimensions.height;
  },

  render: function() {
    var props = Object.assign({}, this.props, {
      onScroll: this.onScroll,
      ref: 'resizable'
    });
    props.style = props.style || {};
    props.style.width = props.style.height = "100%";
    props.style.display = "block";

    return (
      React.createElement('div', props,
        [
          this.props.children,
          React.createElement('div', {className: this.props.triggersClass, key: 'trigger'},
            [
              React.createElement('div', {className: this.props.expandClass, ref: 'expand', key: 'expand'}, React.createElement('div', {ref: 'expandChild'})),
              React.createElement('div', {className: this.props.contractClass, ref: 'contract', key: 'contract'})
            ]
          )
        ]
      )
    );
  }

});

PanelAddons.ResizableContent = ResizableContent;
