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
      this.props.onChange({target: event.target, force: true});
    }
  };

  handleChange = (event) => {
    this.props.onChange(event);
  };

  render() {
    const {classes, width, value} = this.props;

    return (
      <div className={classes.wrapper}>
        <input
          className={classes.input}
          placeholder="Поиск..."
          value={value}
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
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withStyles(styles, {name: 'SearchBox'})(SearchBox);
