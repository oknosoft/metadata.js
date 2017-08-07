"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Drawer = require("material-ui/Drawer");

var _Drawer2 = _interopRequireDefault(_Drawer);

var _IconButton = require("material-ui/IconButton");

var _IconButton2 = _interopRequireDefault(_IconButton);

var _Menu = require("material-ui-icons/Menu");

var _Menu2 = _interopRequireDefault(_Menu);

var _AppBar = require("material-ui/AppBar");

var _AppBar2 = _interopRequireDefault(_AppBar);

var _colors = require("material-ui/styles/colors");

var _List = require("material-ui/List");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NavList extends _react.Component {

  constructor(props) {

    super(props);

    this.handleClose = () => {
      this.props.handleNavlistOpen(false);
    };

    this.handleToggle = () => {
      this.props.handleNavlistOpen(!this.props.navlist_open);
    };

    let key = 0;

    const addItem = (item, recipient) => {

      key += 1;

      if (item.items) {
        const items = [];
        item.items.forEach(item => {
          addItem(item, items);
        });
        recipient.push(_react2.default.createElement(_List.ListItem, {
          key: key,
          primaryText: item.text,
          leftIcon: item.icon,
          initiallyOpen: !!item.open,
          primaryTogglesNestedList: !!item.open,
          nestedItems: items
        }));
      } else {
        recipient.push(_react2.default.createElement(_List.ListItem, {
          key: key,
          primaryText: item.text,
          onTouchTap: this.handleNavigate(item.navigate),
          leftIcon: item.icon
        }));
      }
    };

    this._list = [];
    props.navlist_items.forEach(item => {
      addItem(item, this._list);
    });
  }

  handleNavigate(path) {

    if (typeof path == "function") {
      return path.bind(this);
    }

    return () => {
      this.handleClose();
      this.context.$p.UI.history.push(path);
    };
  }

  render() {

    return _react2.default.createElement(
      "div",
      null,
      _react2.default.createElement(
        _IconButton2.default,
        { onTouchTap: this.handleToggle },
        _react2.default.createElement(_Menu2.default, { color: _colors.white })
      ),
      _react2.default.createElement(
        _Drawer2.default,
        {
          docked: false,
          width: 300,
          open: this.props.navlist_open,
          onRequestChange: open => this.props.handleNavlistOpen(open) },
        _react2.default.createElement(_AppBar2.default, {
          onLeftIconButtonTouchTap: this.handleClose,
          title: this.props.title,
          titleStyle: { fontSize: 18 } }),
        _react2.default.createElement(
          _List.List,
          null,
          this._list
        )
      )
    );
  }
}
exports.default = NavList;
NavList.propTypes = {
  navlist_open: _propTypes2.default.bool,
  handleNavlistOpen: _propTypes2.default.func.isRequired,
  navlist_items: _propTypes2.default.array.isRequired
};
NavList.contextTypes = {
  $p: _react2.default.PropTypes.object.isRequired
};