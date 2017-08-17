
var Toolbar = React.createClass({
  displayName: 'Toolbar',
  mixins: [Mixins.Toolbar],

  render: function () {
    return React.createElement("div", {}, this.props.children );
  }

});

var Content = React.createClass({
  displayName: 'Content',
  mixins: [Mixins.Content],

  render: function () {
    return React.createElement("div", {}, this.props.children );
  }

});

var Footer = React.createClass({
  displayName: 'Footer',
  mixins: [Mixins.Footer],

  render: function () {
    return React.createElement("div", {}, this.props.children );
  }

});

var PanelAddons = {};

var ReactPanels = {
  Panel: Panel,
  FloatingPanel: FloatingPanel,
  ReactPanel: ReactPanel,
  Tab: Tab,
  Mixins: Mixins,
  Toolbar: Toolbar,
  Content: Content,
  Footer: Footer,
  ToggleButton: ToggleButton,
  Button: Button,
  addons: PanelAddons,
  DragAndDropHandler: DragAndDropHandler
};
