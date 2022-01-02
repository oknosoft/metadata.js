import React, {Component} from 'react';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem  from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import classnames from 'classnames';
import withStyles from './menu';
import {withIface} from 'metadata-redux';

import IconExpandMore from '@mui/icons-material/ExpandMore';

export class NavList extends Component {

  constructor(props) {
    super(props);
    // при создании компонента, устанавливаем open для открытых по умолчанию пунктов меню
    const handleIfaceState = props.handleIfaceState.bind(this);
    const open = {
      component: NavList.rname,
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
      component: NavList.rname,
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

NavList.rname = 'NavList';

NavList.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(withIface(NavList));

