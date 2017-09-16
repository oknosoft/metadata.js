/**
 * ### Поле ввода с кнопкой поиска
 *
 * Created by Evgeniy Malyarov on 15.09.2017.
 */


import React from 'react';
import PropTypes from 'prop-types';

import compose from 'recompose/compose';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import withWidth, {isWidthUp} from 'material-ui/utils/withWidth';
import SearchIcon from 'material-ui-icons/Search';
import {fade} from 'material-ui/styles/colorManipulator';
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    alignSelf: 'center',
    background: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      background: fade(theme.palette.common.white, 0.25),
      border: '1px solid #e0e0e0',
    },
    '& $input': {
      transition: theme.transitions.create('width'),
      width: 80,
      '&:focus': {
        width: 220,
        background: theme.palette.common.white,
        // border: '1px solid #e0e0e0',
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

function SearchBox(props) {
  const {classes, width} = props;

  if(!isWidthUp('sm', width)) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      <input className={classes.input} placeholder="Поиск..." onChange={props.onChange}/>
      <div className={classes.search}>
        <SearchIcon/>
      </div>
    </div>
  );
}

SearchBox.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default compose(
  withStyles(styles, {name: 'SearchBox'}),
  withWidth(),
  onlyUpdateForKeys(['width', 'value']),
)(SearchBox);
