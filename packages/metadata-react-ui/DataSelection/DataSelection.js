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

        <IconButton touch={true} onTouchTap={this.handleOpen}>
          <IconFilter />
        </IconButton>

        <Dialog
          title="Dialog With Date Picker"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Open a Date Picker dialog from within a dialog.
          <DatePicker hintText="Date Picker" />
        </Dialog>

      </div>
		)
	}

}
