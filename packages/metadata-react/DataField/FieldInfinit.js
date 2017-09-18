/**
 * ### Поле ввода ссылочных данных на базе InfinitLoader
 *
 * @module FieldInfinit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import AbstractField from './AbstractField';

import TextField from 'material-ui/TextField';
import InfiniteList from './InfiniteList';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui-icons/OpenInNew';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import TitleIcon from 'material-ui-icons/Title';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import withStyles from './styles';

function getSuggestionValue(suggestion) {
  const text = suggestion.toString();
  return text === '_' ? '' : text;
};

class FieldInfinit extends AbstractField {

  constructor(props, context) {

    super(props, context);

    const {_obj, _fld, mandatory} = props;
    const _val = _obj[_fld];

    this.state = {
      options: [_val],
      value: _val,
      focused: false,
    };
  }

  inputRef = el => {
    if (el !== null) {
      this.input = el;
    }
  }

  containerRef = el => {
    if (el !== null) {
      this.itemsContainer = el;
    }
  }

  onHighlightedItemChange = item => {
    this.highlightedItem = item;
  }

  onChange = (value) => {
    const {handleValueChange} = this.props;
    this.setState({value});
    handleValueChange && handleValueChange(value);
  };

  onFocus = (evt) => {
    if(this.blurTimeout){
      clearTimeout(this.blurTimeout);
      this.blurTimeout = 0;
    }
    this.setState({focused: true});
  }

  onBlur = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.blurTimeout = setTimeout(() => this.setState({focused: false}), 100);
  }

  onKeyDown = event => {
    const { inputProps, highlightedSectionIndex, highlightedItemIndex } = this.props;

    switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      const nextPrev = (event.key === 'ArrowDown' ? 'next' : 'prev');
      const [newHighlightedSectionIndex, newHighlightedItemIndex] =
        this.sectionIterator[nextPrev]([highlightedSectionIndex, highlightedItemIndex]);

      inputProps.onKeyDown(event, { newHighlightedSectionIndex, newHighlightedItemIndex });
      break;
    }

    case 'Enter':
      if (highlightedItemIndex !== null) {
        dispatch(updateInputValue(exampleId, items[highlightedSectionIndex].items[highlightedItemIndex].text + ' selected'));
      }
      break;

    default:
      inputProps.onKeyDown(event, { highlightedSectionIndex, highlightedItemIndex });
    }
  }

  renderInput() {
    const {props, state, _meta, onChange, inputRef} = this;
    const {classes, _fld, fullWidth, mandatory} = props;

    const value = getSuggestionValue(state.value);

    return this.isTabular ?
      <input
        type="text"
        ref={inputRef}
        value={value}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_fld}
        onChange={onChange}
      />
      :
      <TextField
        className={classes.formControl}
        fullWidth={fullWidth}
        margin="dense"
        value={value}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        inputRef={inputRef}
        InputProps={{
          classes: {input: classes.input},
          placeholder: _fld,
        }}
        onChange={onChange}
      />;
  }

  renderContainer() {

    const {_meta, props, state, containerRef} = this;

    if(state.focused){
      const {_obj, _fld, classes} = props;
      const {_manager} = _obj[_fld];
      const is_enm = $p.utils.is_enm_mgr(_manager);
      const footer = !is_enm || _meta.type.types.length > 1;

      return state.focused &&
        <Paper
          ref={containerRef}
          square
        >
          <InfiniteList _mgr={_manager} value={_obj[_fld]} search={getSuggestionValue(state.value)}/>
          {footer && <Divider/>}
          {footer && <ListItem>
            <ListItemText inset primary=' '/>
            {_meta.type.types.length > 1 && <IconButton  title="Выбрать тип значения"><TitleIcon/></IconButton>}
            {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton title="Создать элемент"><AddIcon/></IconButton>}
            {!is_enm && _manager.acl.indexOf('v') != -1 && <IconButton  title={_manager.frm_obj_name} onClick={this.handleOpenObj}><OpenInNew/></IconButton>}
          </ListItem>}
          {footer && <Toolbar>
            <Button dense className={classes.a} onClick={this.handleOpenList} title={_manager.frm_selection_name}>{is_enm ? '...' : 'Показать все'}</Button>
          </Toolbar>}
        </Paper>;
    }

  }

  render() {
    return (
      <div tabindex="-1" onBlur={this.onBlur} onFocus={this.onFocus}>
        {this.renderInput()}
        {this.renderContainer()}
      </div>
    );
  }
}

export default withStyles(FieldInfinit);

