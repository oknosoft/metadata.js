/**
 * Фильтрованный список оповещений
 *
 * @module NotiList
 *
 * Created by Evgeniy Malyarov on 17.09.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Checkbox from '@mui/material/Checkbox';

import withStyles from '../Diagrams/styles';
import cn from 'classnames';


class NotiList extends Component {

  state = {
    selected: [],
    page: 0,
    rowsPerPage: 10,
  };

  renderRow = (row, key) => {
    const {classes} = this.props;
    let i;
    if(row.class === 'error') {
      i = <i className="fa fa-exclamation fa-fw"></i>;
    }
    else if(row.class === 'alert') {
      i = <i className="fa fa-bell-o fa-fw"></i>;
    }
    else {
      i = <i className="fa fa-info fa-fw"></i>;
    }
    return <TableRow key={key} hover classes={{root: classes.rowRoot}}>
      <TableCell classes={{body: cn(classes.cellBody, row.key && classes.darkblue)}}>
        {i}
        {row.note || row.class}
      </TableCell>
    </TableRow>;
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const {rows, classes} = this.props;
    const {rowsPerPage, page} = this.state;
    return <div>
      <Table className={classes.table}>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(this.renderRow)}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        labelRowsPerPage="Окно:"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={this.handleChangePage}
        onChangeRowsPerPage={this.handleChangeRowsPerPage}
      />
    </div>;
  }
}

NotiList.propTypes = {
  rows: PropTypes.array.isRequired,
};

export default withStyles(NotiList);
