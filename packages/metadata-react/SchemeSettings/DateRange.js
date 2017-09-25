/**
 *
 *
 * @module DateRange
 *
 * Created by Evgeniy Malyarov on 25.09.2017.
 */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import IconDateRange from 'material-ui-icons/DateRange';

export default class DateRange extends PureComponent {

  static propTypes = {
    _obj: PropTypes.object.isRequired,
    _fld: PropTypes.string.isRequired,
    _meta: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  };

  handleOpen = () => {

  };

  render() {
    return (
      <div className={this.props.classes.inline}>

        <IconButton title="Настройка периода" onClick={this.handleOpen}>
          <IconDateRange/>
        </IconButton>

      </div>
    );
  }

}
