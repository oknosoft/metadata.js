/**
 * Поле - редактор табчасти свойств с видами сравнений
 *
 * @module FieldProps
 *
 * Created by Evgeniy Malyarov on 13.07.2018.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

// окно диалога для показа всплывающей формы
import Dialog from '../App/Dialog';
import TabularSection from '../TabularSection';
import {suggestionText} from './AbstractField';

class FieldProps extends Component {

  handleCloseDialog = (evt) => {
    evt = null;
  };

  render() {
    const {_obj, _fld} = this.props;
    return <Dialog
      open
      noSpace
      title={_obj[_fld].toString()}
      onClose={this.handleCloseDialog}
    >
      <div
        style={{width: 300, height: 300}}
      >
        <TabularSection _obj={_obj} _tabular={_fld} _meta={$p.classes.RowPropsRow._metadata}/>
      </div>
    </Dialog>;
  }

};

export default FieldProps;
