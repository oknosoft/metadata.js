/**
 * ### Поле ввода ссылочных данных на базе InfinitLoader и Downshift
 *
 * @module FieldInfinitDownshift
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Downshift from 'downshift'

import OpenInNew from '@material-ui/icons/OpenInNew';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import TitleIcon from '@material-ui/icons/Title';
import ClearIcon from '@material-ui/icons/Clear';

// окно диалога для показа всплывающей формы
import InfiniteList, {prevent} from './InfiniteList';
import InpitReadOnly from './InpitReadOnly';
import InpitEditable from './InpitEditable';
import OuterDialog from './OuterDialog';


import AbstractField, {suggestionText} from '../AbstractField';
import withStyles from '../styles';
import cn from 'classnames';


class FieldInfinit extends AbstractField {

  static contextTypes = {
    components: PropTypes.object,       // конструкторы DataList и FrmObj передаём через контекст, чтобы исключить зацикливание
  };

  constructor(props, context) {
    super(props, context);
    Object.assign(this.state, {
      dialogOpened: '',
      focused: false,
      inputValue: suggestionText(this.state.value),
    });
  }

  handleSelect = (value) => {
    if(value) {
      const {_obj, _fld, handleValueChange} = this.props;
      _obj[_fld] = value;
      value = _obj[_fld];
      this.handleCloseDialog();
      handleValueChange && handleValueChange(value);
      this.downshift && this.downshift.selectItem(value, {inputValue: suggestionText(value)});
    }
  };

  handleOpenList = (evt) => {
    const {_obj, _fld, tree} = this.props;
    this.setState({dialogOpened: tree ? 'tree' : 'list'});
    this.downshift && this.downshift.closeMenu();
    prevent(evt);
  };

  handleOpenObj = (evt) => {
    const {_obj, _fld} = this.props;
    this.setState({dialogOpened: 'obj'});
    this.downshift && this.downshift.closeMenu();
    prevent(evt);
  };

  handleCloseDialog = () => {
    this.setState({dialogOpened: '', focused: true});
  };

  handleBlur = (evt) => {
    this.isTabular && this.state.dialogOpened && prevent(evt);
  };

  handleKeyBlur = (evt) => {
    if(this.isTabular && this.state.dialogOpened) {
      switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Tab':
      case 'Enter':
        prevent(evt);
        break;
      }
    }
  };

  inputRef = el => {
    this.input = el;
  };

  downshiftRef = el => {
    this.downshift = el;
  };

  inputKeyDown = (evt) => {
    let keyIsSpecial;
    const {downshift} = this;
    if(!downshift) {
      return;
    }
    switch (evt.key) {
    case 'ArrowDown':
      if(!downshift.state.isOpen) {
        downshift.openMenu();
      }
      else {
        const {items, state} = downshift;
        downshift.setState({highlightedIndex: state.highlightedIndex < items.length - 1 ? state.highlightedIndex + 1 : 0});
      };
      keyIsSpecial = true;
      break;
    case 'ArrowUp':
      if(!downshift.state.isOpen) {
        downshift.openMenu();
      }
      else {
        const {items, state} = downshift;
        downshift.setState({highlightedIndex: state.highlightedIndex > 0 ? state.highlightedIndex - 1 : items.length - 1});
      };
      keyIsSpecial = true;
      break;
    case 'Enter':
      if(!downshift.state.isOpen) {
        downshift.openMenu();
      }
      else {
        typeof downshift.state.highlightedIndex === 'number' && downshift.selectItemAtIndex(downshift.state.highlightedIndex);
      };
      keyIsSpecial = true;
      break;
    case 'F2':
      downshift.openMenu();
      break;

    case 'F4':
      if(evt.ctrlKey && evt.shiftKey) {
        this.handleOpenObj(evt);
      }
      else {
        this.handleOpenList(evt);
      }
      keyIsSpecial = true;
      break;
    }
    keyIsSpecial && prevent(evt);
  };

  renderItems({getItemProps, inputValue, highlightedIndex, selectedItem}) {
    const {_meta, props, handleSelect} = this;

    const {_obj, _fld, classes} = props;
    const {_manager} = _obj[_fld];
    const is_enm = $p.utils.is_enm_mgr(_manager);
    const footer = !is_enm || _meta.type.types.length > 1;
    const iconDisabled=!_obj[_fld] || _obj[_fld].empty();

    function clear() {
      handleSelect(_manager.get());
    }

    return (
      _manager ? [
          <InfiniteList
            key="infinite"
            _mgr={_manager}
            _obj={_obj}
            _fld={_fld}
            _meta={_meta}
            is_enm={is_enm}
            classes={classes}
            search={inputValue}
            selectedItem={selectedItem}
            highlightedIndex={highlightedIndex}
            getItemProps={getItemProps}
          />,
          footer && <Divider key="divider"/>,
          footer && <Toolbar key="Toolbar" disableGutters onMouseDown={prevent} onTouchStart={prevent}>
            <Button
              size="small"
              className={classes.a}
              onClick={this.handleOpenList}
              onTouchEnd={this.handleOpenList}
              title={_manager.frm_selection_name}
            >Список</Button>
            <Typography variant="h6" color="inherit" className={classes.flex}> </Typography>

            <IconButton
              title="Очистить"
              disabled={iconDisabled || _meta.disable_clear}
              onClick={clear}
              onTouchEnd={clear}
            ><ClearIcon/></IconButton>

            {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}

            {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton title="Создать элемент"><AddIcon/></IconButton>}

            {!is_enm && _manager.acl.indexOf('v') != -1 &&
            <IconButton
              title={_manager.frm_obj_name}
              disabled={iconDisabled}
              onClick={this.handleOpenObj}
              onTouchEnd={this.handleOpenObj}
            ><OpenInNew/></IconButton>}

          </Toolbar>
        ]
        :
        footer && <Toolbar disableGutters onMouseDown={prevent} onTouchStart={prevent}>
          <Typography variant="h6" color="inherit" className={classes.flex}> </Typography>
          {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}
        </Toolbar>
    );
  }


  render() {

    const {props, state, _meta, paperProps, isTabular} = this;
    const {read_only} = (props.hasOwnProperty('read_only') ? props : _meta);
    const {classes, _obj, _fld} = props;

    return (
      read_only ? <InpitReadOnly
          _meta={_meta}
          _fld={props._fld}
          isTabular={isTabular}
          classes={classes}
          inputValue={state.inputValue}
          fullWidth={props.fullWidth}
          label_position={props.label_position}
      />
        :
        <Downshift
          key="downshift"
          ref={this.downshiftRef}
          onChange={this.handleSelect}
          itemToString={suggestionText}
          initialSelectedItem={state.value}
          initialInputValue={state.inputValue}
          initialIsOpen={isTabular}
        >
          {({isOpen, getLabelProps, getInputProps, getItemProps, inputValue, highlightedIndex, selectedItem, openMenu, closeMenu}) => {
            let zIndex = 1;
            let parent = this.input && this.input.parentElement;
            while(isOpen && parent) {
              const style = getComputedStyle(parent);
              if(style) {
                const elementZIndex = parseInt(style.getPropertyValue('z-index'), 10);
                if(elementZIndex > zIndex) {
                  zIndex = elementZIndex + 1;
                }
              }
              parent = parent.parentElement;
            }
            return <div
              className={classes.root}
              onBlur={this.handleBlur}
              onClick={this.handleBlur}
              onKeyDown={this.handleKeyBlur}
            >
              <InpitEditable
                labelProps={getLabelProps()}
                inputProps={getInputProps({
                  onKeyDown: this.inputKeyDown,
                  onBlur: () => this.setState({focused: false}),
                  onFocus: () => this.setState({focused: true}),
                })}
                inputRef={this.inputRef}
                focused={state.focused}
                isTabular={isTabular}
                _meta={_meta}
                _obj={_obj}
                _fld={_fld}
                isOpen={isOpen}
                classes={classes}
                bar={props.bar}
                fullWidth={props.fullWidth}
                mandatory={props.mandatory}
                label_position={props.label_position}
                handleOpenObj={this.handleOpenObj}
                handleToggle={() => isOpen ? closeMenu() : openMenu()}
              />
              {isOpen && (
                <Popper
                  open
                  anchorEl={this.input}
                  placement="bottom-start"
                  disablePortal={false}
                  style={{zIndex}}
                  modifiers={{
                    flip: {
                      enabled: true,
                    },
                    preventOverflow: {
                      enabled: true,
                      boundariesElement: 'viewport',
                    },
                  }}
                >
                  <Paper
                    square
                    onTouchStart={prevent}
                    onTouchEnd={prevent}
                  >
                    {this.renderItems({getItemProps, inputValue, highlightedIndex, selectedItem})}
                  </Paper>
                </Popper>
              )}
              {
                state.dialogOpened && <OuterDialog
                  _obj={_obj}
                  _fld={_fld}
                  _owner={this}
                  dialogOpened={state.dialogOpened}
                  handleSelect={this.handleSelect}
                  handleCloseDialog={this.handleCloseDialog}
                  components={this.context.components}
                />
              }
            </div>;
          }}
        </Downshift>

    );
  }
}

export default withStyles(FieldInfinit);

