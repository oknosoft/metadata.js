import React, {Component} from 'react';
import PropTypes from 'prop-types';

import List, {ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Collapse from 'material-ui/transitions/Collapse';

import classnames from 'classnames';
import withStyles from './menu';
import withIface from 'metadata-redux/src/withIface';

import IconExpandMore from 'material-ui-icons/ExpandMore';

class NavList extends Component {

  getItems() {
    this.key = 0;
    const items = [];
    for (const item of this.props.items) {
      this.addItem(item, items);
    }
    return items;
  }

  addItem(item, recipient) {
    this.key += 1;
    if (item.items) {
      const items = [];
      item.items.forEach(item => {
        this.addItem(item, items);
      });
      recipient.push(this.menuGroup(item, items));
    }
    else {
      recipient.push(this.menuItem(item));
    }
  }

  menuItem(item) {
    return <ListItem button key={this.key} onClick={this.handleNavigate(item.navigate, item.id)}>
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.text}/>
    </ListItem>;
  }

  menuGroup(item, items) {
    const {props} = this;
    const {list, expand, expandOpen, bold} = props.classes;
    const expanded = props[item.id];
    const expander = this.handleExpanded(item.id);
    return <div key={this.key} className={list}>
      <ListItem button onClick={expander}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText disableTypography className={bold} primary={item.text}/>
        <ListItemSecondaryAction>
          <IconButton className={classnames(expand, {[expandOpen]: expanded})} onClick={expander}>
            <IconExpandMore/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded} transitionDuration="auto" unmountOnExit>
        {items}
      </Collapse>
    </div>;
  }

  handleNavigate(path, id) {

    if (typeof path == 'function') {
      return path.bind(this, id);
    }

    return () => {
      this.props.handleClose();
      this.props.handleNavigate(path);
    };
  }

  handleExpanded(name) {
    return this.props.handleIfaceState.bind(this, {
        component: this.constructor.name,
        name: name,
        value: 'invert',
      });
  }

  render() {

    const {props} = this;
    const {classes} = props;

    return (
      <List dense className={classes.list}>
        {this.getItems()}
      </List>
    );
  }
}

NavList.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(withIface(NavList));

