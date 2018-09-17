/**
 * ### Диаграмма Table
 * стандартными средствами material-ui
 *
 * @module MuiTable
 *
 * Created by Evgeniy Malyarov on 14.09.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


function MuiTable ({width, height, data, classes, isFullscreen}) {

  if(isFullscreen) {
    width = window.innerWidth - 16;
    height = window.innerHeight - 64;
  }
  else if(!height) {
    height = width <= 600 ? width * 1.2 : width / 2.6;
  }

  const {rows, columns} = data;

  function renderRow(row, key) {
    if(!row) {
      if(data.head && data.head.hide) {
        return null;
      }
      return <TableRow key={key} classes={{root: classes.rowRoot}}>
        {
          columns.map((v, ind) => {
            let css;
            if(v.css) {
              css = v.css;
            }
            if(v.width) {
              if(!css) {
                css = {width: v.width};
              }
              else {
                css.width = v.width;
              }
            }
            return <TableCell
              key={`${key}-c${ind}`}
              classes={{head: classes.cellBody}}
              style={css}
            >{v.presentation}</TableCell>;
          })
        }
      </TableRow>;
    }
    return <TableRow key={key} hover classes={{root: classes.rowRoot}}>
      {
        columns.map((v, ind) => {
          const value = row[v.name];
          if(value && typeof value === 'object') {
            return <TableCell
              key={`${key}-c${ind}`}
              classes={{body: classes.cellBody}}
              style={value.css}>{value.presentation || value.value}</TableCell>;
          }
          else {
            return <TableCell
              key={`${key}-c${ind}`}
              classes={{body: classes.cellBody}}
            >{value}</TableCell>;
          }
        })
      }
    </TableRow>;
  }


  return (
    <div className={classes.root} style={{maxWidth: width, maxHeight: height}}>
      <Table padding="dense" className={classes.table}>
        <TableHead>
          {renderRow(null, 'head')}
        </TableHead>
        <TableBody>
          {data.rows.map(renderRow)}
        </TableBody>
      </Table>
    </div>
  );
}

MuiTable.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number,
  data: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  isFullscreen: PropTypes.bool,
};

export default MuiTable;
