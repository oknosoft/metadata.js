import React, { Component, PropTypes } from 'react';

import IconButton from 'material-ui/IconButton';
import IconFilter from 'material-ui/svg-icons/content/filter-list';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import classes from './DataSelection.scss'


export default class DataSelection extends Component{

  static propTypes = {
    selectionChange: PropTypes.func.isRequired,
    selectionValue: PropTypes.object.isRequired
  }

  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };


	render(){

    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

		return(

      <div>

        <IconButton touch={true} tooltip="Фильтр" onTouchTap={this.handleOpen}>
          <IconFilter />
        </IconButton>

        <Dialog
          title="Отбор не задан"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Отбор для данного списка не используется.
          <DatePicker hintText="Период" />
        </Dialog>

      </div>
		)
	}

}
