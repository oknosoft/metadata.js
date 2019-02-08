/**
 * ### Поле ввода с кнопкой поиска
 *
 * Created by Evgeniy Malyarov on 15.09.2017.
 */


import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';
import {fade} from '@material-ui/core/styles/colorManipulator';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    alignSelf: 'center',
    background: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      background: fade(theme.palette.common.white, 0.25),
      //border: '1px solid #e0e0e0',
    },
    '& $input': {
      transition: theme.transitions.create('width'),
      width: 150,
      '&:focus': {
        background: theme.palette.common.white,
      },
    },
    marginRight: theme.spacing.unit,
  },
  search: {
    width: theme.spacing.unit * 4,
    height: '100%',
    position: 'absolute',
    top: 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit * 4}px`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
    },
  },
});

class SearchBox extends React.Component {

  handleKeyDown = (event) => {
    if(event.key === 'Enter' || event.key === 'Tab') {
      this.handleChange({target: event.target, force: true});
    }
  };

  handleChange = ({target, force}) => {
    const {scheme, handleFilterChange} = this.props;
    if(scheme._search !== target.value.toLowerCase() || force) {
      scheme._search = target.value.toLowerCase();
      this._timer && clearTimeout(this._timer);
      if(force) {
        handleFilterChange();
      }
      else {
        this._timer = setTimeout(handleFilterChange, 300);
      }
      this.forceUpdate();
    }
  };

  render() {
    const {classes, scheme} = this.props;

    return (
      <div className={classes.wrapper}>
        <input
          className={classes.input}
          placeholder="Поиск..."
          value={scheme._search}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <div className={classes.search}>
          <SearchIcon/>
        </div>
      </div>
    );
  }
}

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
  scheme: PropTypes.object.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default withStyles(styles, {name: 'SearchBox'})(SearchBox);
