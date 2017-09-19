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
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui-icons/OpenInNew';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import TitleIcon from 'material-ui-icons/Title';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

// окно диалога, чтобы показать всплывающие формы
import DnR from '../DnR/Dialog';

import withStyles from './styles';

function suggestionText(suggestion) {
  const text = suggestion.toString();
  return text === '_' ? '' : text;
};

class FieldInfinit extends AbstractField {

  static contextTypes = {
    components: PropTypes.object,       // конструкторы DataList и FrmObj передаём через контекст, чтобы исключить зацикливание
  };

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld} = props;
    const inputValue = suggestionText(_obj[_fld]);
    this.state = {
      value: _obj[_fld],
      inputValue,
      focused: false,
      search: inputValue,
      selectedItem: -1,
    };
  }

  inputRef = el => {
    if(el !== null) {
      this.input = el;
    }
  };

  infiniteRef = el => {
    if(el !== null) {
      this.infinite = el;
    }
  };

  handleOpenList = (evt) => {
    this.resetBlurTimeout();
    this.setState({dialog: 'list', focused: false});
  };

  handleOpenObj = (evt) => {
    this.resetBlurTimeout();
    this.setState({dialog: 'obj', focused: false});
  };

  handleCloseDialog = (evt) => {
    this.setState({dialog: false});
  };

  handleInputChange = ({target}) => {
    const {value} = target;
    this.setState({
      inputValue: value,
      search: value
    });
  };

  handleSelect = (index) => {
    const {props, infinite} = this;
    if(infinite) {
      const val = infinite.list[index];
      if(val) {
        props._obj[props._fld] = val;
        this.setState({
          inputValue: suggestionText(val),
          focused: false,
        });
      }
    }
  };

  // onChange = (value) => {
  //   const {handleValueChange} = this.props;
  //   this.setState({value});
  //   handleValueChange && handleValueChange(value);
  // };

  onFocus = (evt) => {
    this.resetBlurTimeout();
    this.setState({focused: true});
  };

  onBlur = (evt) => {
    evt.stopPropagation();
    this.blurTimeout = setTimeout(() => this.setState({focused: false}), 100);
  };

  resetBlurTimeout() {
    if(this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = 0;
    }
  }

  onKeyDown = (evt) => {

    switch (evt.key) {
    case 'ArrowDown':
      this.setState({selectedItem: this.state.selectedItem + 1});
      evt.stopPropagation();
      evt.preventDefault();
      break;

    case 'ArrowUp':
      this.setState({selectedItem: this.state.selectedItem - 1});
      evt.stopPropagation();
      evt.preventDefault();
      break;

    case 'Enter':
      if(highlightedItemIndex !== null) {
        //dispatch(updateInputValue(exampleId, items[highlightedSectionIndex].items[highlightedItemIndex].text + ' selected'));
      }
      break;

    default:
      //inputProps.onKeyDown(event, { highlightedSectionIndex, highlightedItemIndex });
    }
  };

  renderInput() {
    const {props, state, _meta, handleInputChange, inputRef} = this;
    const {classes, _fld, fullWidth, mandatory} = props;

    return this.isTabular ?
      <input
        type="text"
        ref={inputRef}
        value={state.inputValue}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_fld}
        onChange={handleInputChange}
      />
      :
      <TextField
        className={classes.formControl}
        fullWidth={fullWidth}
        margin="dense"
        value={state.inputValue}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        inputRef={inputRef}
        InputProps={{
          classes: {input: classes.input},
          placeholder: _fld,
        }}
        onChange={handleInputChange}
      />;
  }

  renderContainer() {

    const {_meta, props, state, infiniteRef, handleSelect} = this;

    if(state.focused) {
      const {_obj, _fld, classes} = props;
      const {_manager} = _obj[_fld];
      const is_enm = $p.utils.is_enm_mgr(_manager);
      const footer = !is_enm || _meta.type.types.length > 1;

      return state.focused &&
        <Paper
          square
          className={classes.suggestionsContainerOpen}
        >
          <InfiniteList
            ref={infiniteRef}
            _mgr={_manager}
            _obj={_obj}
            _fld={_fld}
            _meta={_meta}
            classes={classes}
            search={state.search}
            suggestionText={suggestionText}
            handleSelect={handleSelect}
            selectedItem={state.selectedItem}
          />
          {footer && <Divider/>}
          {footer && <Toolbar className={classes.bar}>
            <Button dense className={classes.a} onClick={this.handleOpenList} title={_manager.frm_selection_name}>{is_enm ? '...' : 'Показать все'}</Button>
            <Typography type="title" color="inherit" className={classes.flex}> </Typography>
            {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}
            {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton title="Создать элемент"><AddIcon/></IconButton>}
            {!is_enm && _manager.acl.indexOf('v') != -1 && <IconButton title={_manager.frm_obj_name} onClick={this.handleOpenObj}><OpenInNew/></IconButton>}
          </Toolbar>}
        </Paper>;
    }

  }

  renderDialog() {
    const {props, state, context} = this;

    if(state.dialog) {
      const {_obj, _fld} = props;
      const {_manager, ref} = _obj[_fld];
      const _acl = $p.current_user.get_acl(_manager.class_name);
      const {DataList, DataObj} = context.components;
      const title = state.dialog == 'list' ?
        (_manager.metadata().list_presentation || _manager.metadata().synonym)
        :
        (_manager.metadata().obj_presentation || _manager.metadata().synonym);

      return <DnR title={title} onClose={this.handleCloseDialog}>
        {state.dialog == 'list' ?
          <DataList _mgr={_manager} _acl={_acl} handlers={{}}/>
          :
          <DataObj _mgr={_manager} _acl={_acl} match={{params: {ref}}} handlers={{}}/>
        }
      </DnR>;
    }
  }

  render() {
    //tabIndex="-1"
    return (
      <div
        className={this.props.classes.root}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        onKeyDown={this.onKeyDown}
      >
        {this.renderInput()}
        {this.renderContainer()}
        {this.renderDialog()}
      </div>
    );
  }
}

export default withStyles(FieldInfinit);

