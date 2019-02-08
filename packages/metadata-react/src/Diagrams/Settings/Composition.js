/**
 * Состав диаграмм
 *
 * @module Composition
 *
 * Created by Evgeniy Malyarov on 01.09.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'metadata-external/react-data-grid.min';
import {Draggable} from 'metadata-external/react-data-grid-addons.min';

const {Container: DraggableContainer, RowActionsCell, DropTargetRowContainer} = Draggable;
const RowRenderer = DropTargetRowContainer(ReactDataGrid.Row);

const columns = [
  {key:"name", name: "Диаграмма"}
];

class Composition extends Component {

  rowSelection(rows) {
    return {
      showCheckbox: true,
      enableShiftSelect: true,
      selectBy: {
        keys: {
          rowKey: 'row',
          markKey: 'use',
          values: rows.filter(r => r.use).map(r => r.row)
        }
      },
      onRowsSelected: this.onRowsSelected,
      onRowsDeselected: this.onRowsDeselected,
    };
  }

  rowGetter = (i) => {
    return this.props.rows[i];
  };

  onRowsSelected = (select) => {
    for(const {row} of select) {
      row.use = true;
    }
    this.onRowsFinish();
  };

  onRowsDeselected = (select) => {
    for(const {row} of select) {
      row.use = false;
    }
    this.onRowsFinish();
  };

  onRowsFinish() {
    this.forceUpdate();
    const {props} = this;
    props.changeCharts(props.rows)
      .then(props.onChange);
  }

  reorderRows = ({rowSource, rowTarget}) => {
    const {rows} = this.props;
    const draggedRows = [rowSource.data];
    const undraggedRows = rows.filter((r) => draggedRows.indexOf(r) === -1);
    const args = [rowTarget.idx, 0].concat(draggedRows);
    rows.length = 0;
    Array.prototype.splice.apply(undraggedRows, args);
    Array.prototype.push.apply(rows, undraggedRows);
    this.onRowsFinish();
  };

  render() {
    const {rows} = this.props;
    const height = 60 + rows.length * 35;
    return (
      <DraggableContainer>
        <ReactDataGrid
          rowKey="row"
          enableCellSelection={true}
          rowActionsCell={RowActionsCell}
          columns={columns}
          rowGetter={this.rowGetter}
          rowsCount={rows.length}
          minHeight={height > 300 ? 300 : height}
          minWidth={260}
          rowRenderer={<RowRenderer onRowDrop={this.reorderRows}/>}
          rowSelection={this.rowSelection(rows)}
        />
      </DraggableContainer>
    );
  }

}

Composition.propTypes = {
  rows:       PropTypes.array.isRequired,
  changeCharts: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Composition;
