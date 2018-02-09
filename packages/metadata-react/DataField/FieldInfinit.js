/**
 * ### Поле ввода ссылочных данных на базе InfinitLoader
 *
 * @module FieldInfinit
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Input, {InputLabel, InputAdornment} from 'material-ui/Input';
import {FormControl} from 'material-ui/Form';
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
import Dialog from '../App/Dialog';
import InfiniteList, {prevent} from './InfiniteList';

import AbstractField, {suggestionText} from './AbstractField';
import withStyles from './styles';

class FieldInfinit extends AbstractField {

  static contextTypes = {
    components: PropTypes.object,       // конструкторы DataList и FrmObj передаём через контекст, чтобы исключить зацикливание
  };

  constructor(props, context) {
    super(props, context);
    const inputValue = suggestionText(this.state.value);
    Object.assign(this.state, {
      inputValue,
      focused: false,
      containerOpened: false,
      dialogOpened: '',
      search: inputValue,
    });
  }

  inputRef = el => {
    this.input = el;
  };

  infiniteRef = el => {
    this.infinite = el;
  };

  handleOpenList = () => {
    this.resetBlurTimeout();

    const {_obj, _fld} = this.props;
    this.setState({
      containerOpened: false,
      dialogOpened: 'list',
      inputValue: _obj && suggestionText(_obj[_fld])
    });
  };

  handleOpenObj = () => {
    this.resetBlurTimeout();
    const {_obj, _fld} = this.props;
    this.setState({
      containerOpened: false,
      dialogOpened: 'obj',
      inputValue: _obj && suggestionText(_obj[_fld])
    });
  };

  handleOpenContainer = () => {
    this.setState({containerOpened: true});
  };

  handleCloseDialog = (evt) => {
    this.setState({dialogOpened: ''});
  };

  handleInputChange = ({target}) => {
    const {value} = target;
    this.setState({
      inputValue: value,
      search: value,
      containerOpened: true,
    });
  };

  handleSelect = (value) => {
    if(value) {
      const {_obj, _fld, handleValueChange} = this.props;
      _obj[_fld] = value;
      setTimeout(() => {
        this.setState({
          containerOpened: false,
          dialogOpened: '',
          inputValue: suggestionText(value)
        });
        handleValueChange && handleValueChange(value);
      });
    }
  };

  onFocus = (evt) => {
    this.resetBlurTimeout();
    !this.state.dialogOpened && this.setState({
      focused: true,
    });
  };

  onBlur = (evt) => {
    evt.stopPropagation();
    this.blurTimeout = setTimeout(() => {
      const {_obj, _fld} = this.props;
      this.setState({
        focused: false,
        containerOpened: false,
        inputValue: _obj && suggestionText(_obj[_fld])
      });
    }, 100);
  };

  resetBlurTimeout() {
    if(this.blurTimeout) {
      clearTimeout(this.blurTimeout);
      this.blurTimeout = 0;
    }
  }

  onKeyDown = (evt) => {
    let keyIsSpecial;
    switch (evt.key) {
    case 'ArrowDown':
      if(this.infinite) {
        this.infinite.next(evt);
      }
      else {
        this.handleOpenContainer();
      }
      ;
      keyIsSpecial = true;
      break;

    case 'ArrowUp':
      if(this.infinite) {
        this.infinite && this.infinite.prev(evt);
      }
      else {
        this.handleOpenContainer();
      }
      ;
      keyIsSpecial = true;
      break;

    case 'Enter':
      if(this.infinite) {
        this.infinite && this.infinite.handleSelect(evt);
      }
      else {
        this.handleOpenContainer();
      }
      ;
      keyIsSpecial = true;
      break;

    case 'Escape':
      this.setState({containerOpened: false});
      keyIsSpecial = true;
      break;

    case 'F2':
      this.handleOpenContainer();
      keyIsSpecial = true;
      break;

    case 'F4':
      if(evt.ctrlKey && evt.shiftKey) {
        this.handleOpenObj();
      }
      else {
        this.handleOpenList();
      }
      keyIsSpecial = true;
      break;
    }
    keyIsSpecial && prevent(evt);
  };

  renderInput() {
    const {props, state, _meta, handleInputChange, handleOpenContainer, inputRef} = this;
    const {classes, _obj, _fld, fullWidth, mandatory} = props;

    return this.isTabular ?
      <input
        type="text"
        ref={inputRef}
        value={state.inputValue}
        title={_meta.tooltip || _meta.synonym}
        placeholder="Введите текст для поиска"
        onChange={handleInputChange}
        onClick={handleOpenContainer}
      />
      :
      <FormControl
        className={classes.formControl}
        fullWidth={fullWidth}
        margin="dense"
        onDoubleClick={handleOpenContainer}
      >
        <InputLabel>{_meta.tooltip || _meta.synonym}</InputLabel>
        <Input
          inputRef={inputRef}
          value={state.inputValue}
          onChange={handleInputChange}
          classes={{input: classes.input}}
          placeholder={_fld}
          endAdornment={state.focused &&
          <InputAdornment position="end">
            <IconButton
              tabIndex={-1}
              className={classes.icon}
              title={_obj[_fld]._manager.frm_obj_name}
              onClick={this.handleOpenObj}
              onMouseDown={prevent}
            >
              <OpenInNew/>
            </IconButton>
          </InputAdornment>
          }
        />
      </FormControl>;
  }

  renderContainer() {

    const {_meta, props, state, input, infiniteRef, handleSelect} = this;

    if(state.containerOpened) {
      const {_obj, _fld, classes} = props;
      const {_manager} = _obj[_fld];
      const is_enm = $p.utils.is_enm_mgr(_manager);
      const footer = !is_enm || _meta.type.types.length > 1;
      const rect = input && input.getBoundingClientRect();
      const paperProps = {
        square: true,
        className: classes.suggestionsContainerOpen,
      };
      if(rect) {
        const {innerHeight} = window;
        if(rect.bottom + 220 < innerHeight) {
          paperProps.style = {top: rect.bottom};
        }
        else if(rect.top > 220) {
          paperProps.style = {bottom: innerHeight - rect.top - 12};
        }
        else {
          paperProps.style = {top: 10};
        }
      }
      return <Paper {...paperProps}>
        <InfiniteList
          ref={infiniteRef}
          _mgr={_manager}
          _obj={_obj}
          _fld={_fld}
          _meta={_meta}
          is_enm={is_enm}
          classes={classes}
          search={state.search}
          handleSelect={handleSelect}
        />
        {footer && <Divider/>}
        {footer && <Toolbar disableGutters>
          <Button size="small" className={classes.a} onClick={this.handleOpenList} title={_manager.frm_selection_name}>{is_enm ? '...' : 'Показать все'}</Button>
          <Typography variant="title" color="inherit" className={classes.flex}> </Typography>
          {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}
          {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton title="Создать элемент"><AddIcon/></IconButton>}
          {!is_enm && _manager.acl.indexOf('v') != -1 && this.isTabular &&
          <IconButton title={_manager.frm_obj_name} onClick={this.handleOpenObj}><OpenInNew/></IconButton>}
        </Toolbar>}
      </Paper>;
    }

  }

  renderDialog() {
    const {props, state, context, handleSelect} = this;

    if(state.dialogOpened) {
      const {_obj, _fld} = props;
      const {_manager, ref} = _obj[_fld];
      const _acl = $p.current_user.get_acl(_manager.class_name);
      const {DataList, DataObj} = context.components;
      const title = state.dialogOpened == 'list' ?
        (_manager.metadata().list_presentation || _manager.metadata().synonym)
        :
        (_manager.metadata().obj_presentation || _manager.metadata().synonym);

      return <Dialog
        open
        noSpace
        title={title}
        onClose={this.handleCloseDialog}
      >
        {state.dialogOpened == 'list' ?
          <DataList _mgr={_manager} _acl={_acl} _owner={this} selectionMode handlers={{handleSelect}}/>
          :
          <DataObj _mgr={_manager} _acl={_acl} match={{params: {ref}}} handlers={{}}/>
        }
      </Dialog>;
    }
  }

  render() {
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

