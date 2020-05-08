/**
 * ### Поле ввода с кнопкой поиска
 *
 * Created by Evgeniy Malyarov on 15.09.2017.
 */


import React from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/styles';

const styles = ({typography, palette, transitions, spacing, breakpoints}) => ({
  wrapper: {
    fontFamily: typography.fontFamily,
    position: 'relative',
    alignSelf: 'center',
    background: fade(palette.common.white, 0.15),
    '&:hover': {
      background: fade(palette.common.white, 0.25),
      //border: '1px solid #e0e0e0',
    },
    '& $input': {
      transition: transitions.create('width'),
      width: 120,
      [breakpoints.up('sm')]: {
        width: 200,
      },
      [breakpoints.up('lg')]: {
        width: 280,
      },
      '&:focus': {
        background: palette.common.white,
      },
    },
    marginRight: spacing(),
  },
  search: {
    width: spacing(4),
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
    padding: `${spacing()}px ${spacing()}px ${spacing()}px ${spacing(4)}px`,
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
        this._timer = setTimeout(handleFilterChange, 900);
      }
      this.forceUpdate();
    }
  };

  render() {
    const {classes, scheme, isWidthUp, handleFilterChange, ...other} = this.props;

    return (
      <div className={classes.wrapper}>
        <input
          className={classes.input}
          placeholder="Поиск..."
          value={scheme._search}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          type={isWidthUp ? 'search' : 'text'}
          {...other}
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
  isWidthUp: PropTypes.bool,
};

export default withStyles(styles, {name: 'SearchBox'})(SearchBox);
