
/**
 * Requires: jQuery + jQuery niceScroll plugin
 */
var ScrollableTabContent = React.createClass({
  displayName: 'ScrollableTabContent',
  mixins: [Mixins.Content],

  getDefaultProps: function () {
    return {
      "height": 250,
      "opts": {
        cursorcolor: "rgb(139, 128, 102)",
        cursoropacitymin: 0.25,
        cursoropacitymax: 0.5,
        cursorwidth: 9,
        cursorminheight: 60
      }
    };
  },

  componentDidMount: function () {
    $(this.refs.content.getDOMNode()).niceScroll(this.refs.wrapper.getDOMNode(), this.props.opts);
  },

  render: function() {
    var contentStyle = {
      height: Utils.pixelsOf(this.props.height),
      paddingRight: Utils.pixelsOf((this.props.opts.cursorwidth || 5) + 4),
      overflow: "scroll"
    };
    return (
      React.createElement("div", {ref:"content", style:contentStyle},
        React.createElement("div",{ref:"wrapper"},
          this.props.children
        )
      )
    );
  }

});

PanelAddons.ScrollableTabContent = ScrollableTabContent;
