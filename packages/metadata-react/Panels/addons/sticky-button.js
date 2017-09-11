
var StickyButton = React.createClass({
  displayName: 'StickyButton',
  mixins: [Mixins.Button],

  handleClick: function () {
    this.setState({active: !this.state.active});
    this._trigger();
  },

  handleDoubleClick: function () {
    this.setState({highlighted: !this.state.highlighted});
    this._trigger();
  },

  handleContextMenu: function () {
    this.setState({highlighted: !this.state.highlighted});
    this._trigger();
  },

  _trigger: function () {
    this.forceUpdate(function () {
      if (typeof this.props.onChange === "function") {
        this.props.onChange(this);
      }
    }.bind(this));
  },

  render: function () {
    var sheet = this.getSheet('Button');

    return (
      React.createElement("li", Object.assign({style: sheet.style},  this.listeners, {title: this.props.title}),
        React.createElement("span", {style: sheet.children.style},
          this.props.children
        )
      )
    );
  }
});

PanelAddons.StickyButton = StickyButton;
