import React, {Component} from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem  from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

import classnames from 'classnames';
import withStyles from './menu';
import {withIface} from 'metadata-redux';

import IconExpandMore from '@material-ui/icons/ExpandMore';

class NavList extends Component {

  constructor(props) {
    super(props);
    // при создании компонента, устанавливаем open для открытых по умолчанию пунктов меню
    const handleIfaceState = props.handleIfaceState.bind(this);
    const open = {
      component: this.constructor.name,
      name: '',
      value: true,
    };
    for (const item of props.items) {
      if(item.open && item.id) {
        open.name = item.id;
        handleIfaceState(open);
      }
    }
  }

  getItems() {
    this.key = 0;
    const items = [];
    for (const item of this.props.items) {
      this.addItem(item, items);
    }
    return items;
  }

  addItem(item, recipient, ident) {
    this.key += 1;
    if(item.items) {
      const items = [];
      item.items.forEach(item => {
        this.addItem(item, items, true);
      });
      recipient.push(this.menuGroup(item, items));
    }
    else if(item.divider) {
      recipient.push(<Divider key={this.key}/>);
    }
    else {
      recipient.push(this.menuItem(item, ident));
    }
  }

  menuItem(item, ident) {
    const props = {
      button: true,
      key: this.key,
      onClick: this.handleNavigate(item.navigate, item.id),
    };
    const {nested, bold} = this.props.classes;
    return <ListItem {...props} >
      {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
      <ListItemText disableTypography className={classnames({[nested]: ident, [bold]: item.bold})} primary={item.text}/>
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
        <ListItemText disableTypography className={classnames({[bold]: item.bold})} primary={item.text}/>
        <ListItemSecondaryAction>
          <IconButton className={classnames(expand, {[expandOpen]: expanded})} onClick={expander}>
            <IconExpandMore/>
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={expanded} unmountOnExit>
        {items}
      </Collapse>
    </div>;
  }

  handleNavigate(path, id) {

    if(typeof path == 'function') {
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

