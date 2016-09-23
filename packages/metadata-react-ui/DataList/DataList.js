import React, { Component, PropTypes } from 'react';

import ReactDataGrid from 'react-data-grid';
import ReactDataGridPlugins from 'react-data-grid/addons';

import CircularProgress from 'material-ui/CircularProgress';

import Toolbar from './Toolbar'

import classes from './DataList.scss'

//helper to generate a random date
function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
}

//helper to create a fixed number of rows
function createRows(numberOfRows, params){
	var _rows = [];

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

//Custom Formatter component
var DateFormatter = (props) => (<div>{props.value.toLocaleDateString()}</div>);

export default class DataList extends Component{

	// getInitialState(){
	// 	return {
	// 	  rows : createRows(1000, this.props.params)}
	// }

  get rowsCount() {

    return this.props._mgr ? this.props._mgr.alatable.length : 0

  }

  rowGetter = (index) => {

    return this.props._mgr ? this.props._mgr.alatable[index] : {}

    //var _obj = this.props._mgr ? this.props._mgr.alatable[index] : null;
    //return _obj ? this.props._mgr.get(_obj.ref) : {}
    //({ index }) => this._mgr ? this._mgr.alatable[index] : {}
  }

  createColumns(){

    //Columns definition
    var _columns = [];
    if(this.props._mgr){
      this.props._mgr.caption_flds({ metadata: null, form: this.props.params.form }).forEach(function (col) {

        var width = parseInt(col.width),
          column = width ? {
            key: col.id,
            name: col.caption,
            width: width,
            resizable: true
          } : {
            key: col.id,
            name: col.caption
          };

        if(col.id.indexOf('date') != -1)
            column.formatter = DateFormatter

        _columns.push(column)
      })

    }else{
      _columns = [
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
    }


    return _columns;
  }

	handleRowUpdated(e){
		//merge updated row with current row and rerender by setting state
		// var rows = this.state.rows;
		// Object.assign(rows[e.rowIdx], e.updated);
		// this.setState({rows:rows});
	}

  handleAdd(e){

  }

  handleEdit(e){

  }

  handleRemove(e){

  }

  handleSelectionChange(e){

  }

  handlePrint(e){

  }

  handleAttachment(e){

  }

	render(){
		return(

      this.props.meta.data_loaded ?

      <div >

        <Toolbar
          handleAdd={this.handleAdd}
          handleEdit={this.handleEdit}
          handleRemove={this.handleRemove}
          handleSelectionChange={this.handleSelectionChange}
          handlePrint={this.handlePrint}
          handleAttachment={this.handleAttachment}
        />

        <ReactDataGrid
          enableCellSelect={false}
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
