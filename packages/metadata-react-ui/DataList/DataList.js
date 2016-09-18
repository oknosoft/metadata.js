import React, { Component, PropTypes } from 'react';

import ReactDataGrid from 'react-data-grid';
import ReactDataGridPlugins from 'react-data-grid/addons';

import CircularProgress from 'material-ui/CircularProgress';

import Toolbar from './Toolbar'

import $p from 'metadata'

import classes from './DataList.scss'

//helper to generate a random date
function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
}

//helper to create a fixed number of rows
function createRows(numberOfRows, params){
	var _rows = [];
  var _mgr = $p.md.mgr_by_class_name(params.meta);

	for (var i = 1; i < numberOfRows; i++) {
		_rows.push({
			id: i,
			task: 'Task ' + i,
			complete: Math.min(100, Math.round(Math.random() * 110)),
			priority : ['Critical', 'High', 'Medium', 'Low'][Math.floor((Math.random() * 3) + 1)],
			issueType : ['Bug', 'Improvement', 'Epic', 'Story'][Math.floor((Math.random() * 3) + 1)],
			startDate: randomDate(new Date(2015, 3, 1), new Date()),
			completeDate: randomDate(new Date(), new Date(2016, 0, 1))
		});
	}
	return _rows;
}

export default class DataList extends Component{

	// getInitialState(){
	// 	return {
	// 	  rows : createRows(1000, this.props.params)}
	// }

  get rowsCount() {

    if(!this._mgr)
      this._mgr = $p.md.mgr_by_class_name(this.props.params.meta);

    return this._mgr ? this._mgr.alatable.length : 0
  }

  rowGetter = (index) => {
    return this._mgr ? this._mgr.alatable[index] : {}
    //({ index }) => this._mgr ? this._mgr.alatable[index] : {}
  }

  createColumns(){

    if(!this._mgr)
      this._mgr = $p.md.mgr_by_class_name(this.props.params.meta);

    //Columns definition
    var _columns = [
      {
        key: 'id',
        name: 'ID',
        width: 90
      },
      {
        key: 'name',
        name: 'Name',
        editable : true
      },
      {
        key: 'priority',
        name: 'Priority',
        editable : true
      },
      {
        key: 'issueType',
        name: 'Issue type',
        editable : true
      },
      {
        key: 'complete',
        name: '% Complete',
        editable : true
      },
      {
        key: 'startDate',
        name: 'Start Date',
        editable : true
      },
      {
        key: 'completeDate',
        name: 'Expected Complete',
        editable : true
      }
    ]
    return _columns;
  }

	handleRowUpdated(e){
		//merge updated row with current row and rerender by setting state
		// var rows = this.state.rows;
		// Object.assign(rows[e.rowIdx], e.updated);
		// this.setState({rows:rows});
	}

	render(){
		return(

      this.props.meta.data_loaded ?

      <div >

        <Toolbar />

        <ReactDataGrid
          enableCellSelect={true}
          columns={this.createColumns()}
          rowGetter={this.rowGetter}
          rowsCount={this.rowsCount}
          minHeight={400}
          onRowUpdated={this.handleRowUpdated}
        />

      </div>

        :
        <div ><CircularProgress size={1.5} className={classes.progress} /></div>
		)
	}

}
