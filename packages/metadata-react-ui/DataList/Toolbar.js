import React from 'react'
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add-circle-outline';
import IconRemove from 'material-ui/svg-icons/action/delete';
import IconEdit from 'material-ui/svg-icons/image/edit';

import Filter from './Filter';

import classes from './DataList.scss'

export default (props) => (
  <Toolbar className={classes.toolbar}>
    <ToolbarGroup firstChild={true}>
      <IconButton touch={true}>
        <IconAdd />
      </IconButton>
      <IconButton touch={true}>
        <IconEdit />
      </IconButton>
      <IconButton touch={true}>
        <IconRemove />
      </IconButton>

      <ToolbarSeparator />
      <Filter />

    </ToolbarGroup>
  </Toolbar>
)
