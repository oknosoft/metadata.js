import React, {Component, PropTypes} from "react";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import AppBar from "material-ui/AppBar";
import {white} from "material-ui/styles/colors";
import {List, ListItem} from "material-ui/List";


export default class NavList extends Component {

  static propTypes = {
    navlist_open: PropTypes.bool,
    handleNavlistOpen: PropTypes.func.isRequired,
    navlist_items: PropTypes.array.isRequired
  }

  static contextTypes = {
    $p: React.PropTypes.object.isRequired
  }

  constructor (props) {

    super(props)

    let key = 0

    const addItem = (item, recipient) => {

      key+= 1;

      if(item.items){
        const items = []
        item.items.forEach(item => {
          addItem(item, items)
        })
        recipient.push(
          <ListItem
            key={key}
            primaryText={item.text}
            leftIcon={item.icon}
            initiallyOpen={!!item.open}
            primaryTogglesNestedList={!!item.open}
            nestedItems={items}
          />
        )

      }else{
        recipient.push(
          <ListItem
            key={key}
            primaryText={item.text}
            onTouchTap={this.handleNavigate(item.navigate)}
            leftIcon={item.icon}
          />
        )
      }
    }

    this._list = []
    props.navlist_items.forEach(item => {
      addItem(item, this._list)
    })

  }

  handleClose = () => {
    this.props.handleNavlistOpen(false)
  }

  handleToggle = () => {
    this.props.handleNavlistOpen(!this.props.navlist_open)
  }

  handleNavigate (path) {

    return () => {
      this.handleClose()
      this.context.$p.UI.history.push(path)
    }
  }

  render() {

    return (
      <div>

        <IconButton onTouchTap={this.handleToggle} >
          <NavigationMenu color={white} />
        </IconButton>

        <Drawer
          docked={false}
          width={300}
          open={this.props.navlist_open}
          onRequestChange={(open) => this.props.handleNavlistOpen(open)} >

          <AppBar
            onLeftIconButtonTouchTap={this.handleClose}
            title={this.props.title}
            titleStyle={{fontSize: 18}} />

          <List>
            {this._list}
          </List>

        </Drawer>

      </div>
    );
  }
}

