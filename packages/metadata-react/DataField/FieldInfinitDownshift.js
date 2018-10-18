/**
 * ### Поле ввода ссылочных данных на базе InfinitLoader и Downshift
 *
 * @module FieldInfinitDownshift
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Downshift from 'downshift'

import OpenInNew from '@material-ui/icons/OpenInNew';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import TitleIcon from '@material-ui/icons/Title';

// окно диалога для показа всплывающей формы
import Dialog from '../App/Dialog';
import InfiniteList, {prevent} from './InfiniteList';

import AbstractField, {suggestionText} from './AbstractField';
import withStyles from './styles';
import cn from 'classnames';


function InpitReadOnly(props) {
  const {_meta, classes} = props;
  return props.isTabular ?
    <div>
      <input
        type="text"
        value={props.inputValue}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_meta.synonym || _meta.tooltip}
        readOnly
      />
    </div>
    :
    <div className={classes.root}>
      <FormControl
        className={cn(classes.formControl, props.bar && classes.barInput)}
        fullWidth={props.fullWidth}
        disabled
      >
        {props.label_position != 'hide' && <InputLabel>{_meta.tooltip || _meta.synonym}</InputLabel>}
        <Input
          value={props.inputValue}
          classes={{input: classes.input}}
          placeholder={props.label_position == 'hide' ? (_meta.tooltip || _meta.synonym) : props._fld}
        />
      </FormControl>
    </div>
}

function InpitEditable(props) {
  const {_meta, _obj, _fld, classes, fullWidth, mandatory, label_position, inputValue, inputRef, inputProps, labelProps} = props;

  return props.isTabular ?
    <input
      type="text"
      title={_meta.tooltip || _meta.synonym}
      placeholder="Введите текст для поиска"
      {...inputProps}
      ref={inputRef}
    />
    :
    <FormControl
      className={cn(classes.formControl, props.bar && classes.barInput)}
      fullWidth={fullWidth}
      onDoubleClick={null}
    >
      {label_position != 'hide' && <InputLabel {...labelProps}>{_meta.tooltip || _meta.synonym}</InputLabel>}
      <Input
        {...inputProps}
        inputRef={inputRef}
        classes={{input: classes.input}}
        placeholder={label_position == 'hide' ? (_meta.tooltip || _meta.synonym) : _fld}
        endAdornment={props.focused &&
        <InputAdornment position="end">
          <IconButton
            tabIndex={-1}
            className={classes.icon}
            title={_obj[_fld]._manager.frm_obj_name}
            onClick={props.handleOpenObj}
            onMouseDown={prevent}
          >
            <OpenInNew/>
          </IconButton>
        </InputAdornment>
        }
      />
    </FormControl>;
}


class FieldInfinitDownshift extends AbstractField {

  static contextTypes = {
    components: PropTypes.object,       // конструкторы DataList и FrmObj передаём через контекст, чтобы исключить зацикливание
  };

  constructor(props, context) {
    super(props, context);
    Object.assign(this.state, {
      dialogOpened: '',
      inputValue: suggestionText(this.state.value),
    });
  }

  handleSelect = (value) => {
    if(value) {
      const {_obj, _fld, handleValueChange} = this.props;
      _obj[_fld] = value;
      this.setState({dialogOpened: ''});
      handleValueChange && handleValueChange(value);
    }
  };

  handleOpenList = () => {
    const {_obj, _fld} = this.props;
    this.setState({dialogOpened: 'list'});
  };

  handleOpenObj = () => {
    const {_obj, _fld} = this.props;
    this.setState({dialogOpened: 'obj'});
  };

  handleCloseDialog = (evt) => {
    this.setState({dialogOpened: ''});
  };

  inputRef = el => {
    this.input = el;
  };

  paperProps = () => {
    const {input, props: {classes}} = this;
    const props = {
      square: true,
      className: classes.suggestionsContainerOpen,
    };
    const rect = input && input.getBoundingClientRect();
    if(rect) {
      const {innerHeight, innerWidth} = window;
      if(rect.bottom + 220 < innerHeight) {
        props.style = {top: rect.bottom};
      }
      else if(rect.top > 220) {
        props.style = {bottom: innerHeight - rect.top - 12};
      }
      else {
        props.style = {top: 10};
      }
      if(rect.left + 308 > innerWidth) {
        props.style = Object.assign({left: innerWidth - 308}, props.style);
      }
    }
    return props;
  }

  renderItems({getItemProps, inputValue, highlightedIndex, selectedItem}) {
    const {_meta, props, handleSelect} = this;

    const {_obj, _fld, classes} = props;
    const {_manager} = _obj[_fld];
    const is_enm = $p.utils.is_enm_mgr(_manager);
    const footer = !is_enm || _meta.type.types.length > 1;

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
          footer && <Toolbar key="Toolbar" disableGutters>
            <Button size="small" className={classes.a} onClick={this.handleOpenList} title={_manager.frm_selection_name}>{is_enm ? '...' : 'Показать все'}</Button>
            <Typography variant="h6" color="inherit" className={classes.flex}> </Typography>
            {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}
            {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton title="Создать элемент"><AddIcon/></IconButton>}
            {!is_enm && _manager.acl.indexOf('v') != -1 && this.isTabular &&
            <IconButton title={_manager.frm_obj_name} onClick={this.handleOpenObj}><OpenInNew/></IconButton>}
          </Toolbar>
        ]
        :
        footer && <Toolbar disableGutters>
          <Typography variant="h6" color="inherit" className={classes.flex}> </Typography>
          {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}
        </Toolbar>
    );
  }

  renderDialog() {
    const {props, state: {dialogOpened}, context, handleSelect} = this;

    const {_obj, _fld} = props;
    const {_manager, ref} = _obj[_fld];
    const _acl = $p.current_user.get_acl(_manager.class_name);
    const {DataList, DataObj} = context.components;
    const title = dialogOpened == 'list' ?
      (_manager.metadata().list_presentation || _manager.metadata().synonym)
      :
      (_manager.metadata().obj_presentation || _manager.metadata().synonym);

    return <Dialog
      open
      noSpace
      title={title}
      onClose={this.handleCloseDialog}
    >
      {dialogOpened == 'list' ?
        <DataList _mgr={_manager} _acl={_acl} _owner={this} selectionMode handlers={{handleSelect}}/>
        :
        <DataObj _mgr={_manager} _acl={_acl} match={{params: {ref}}} handlers={{}}/>
      }
    </Dialog>;
  }

  render() {

    const {props, state, _meta, paperProps} = this;
    const {read_only} = (props.hasOwnProperty('read_only') ? props : _meta);
    const {classes} = props;

    return (
      read_only ? <InpitReadOnly
          _meta={_meta}
          _fld={props._fld}
          isTabular={this.isTabular}
          classes={classes}
          inputValue={state.inputValue}
          fullWidth={props.fullWidth}
          label_position={props.label_position}
      />
        :
        [
          <Downshift
            key="downshift"
            onChange={this.handleSelect}
            itemToString={suggestionText}
            initialSelectedItem={state.value}
            initialInputValue={state.inputValue}
          >
            {({isOpen, getLabelProps, getInputProps, getItemProps, inputValue, highlightedIndex, selectedItem}) => (
              <div className={classes.root}>
                <InpitEditable
                  labelProps={getLabelProps()}
                  inputProps={getInputProps()}
                  inputRef={this.inputRef}
                  isTabular={this.isTabular}
                  _meta={_meta}
                  _obj={props._obj}
                  _fld={props._fld}
                  classes={classes}
                  bar={props.bar}
                  fullWidth={props.fullWidth}
                  mandatory={props.mandatory}
                  label_position={props.label_position}
                />
                {isOpen && (
                  <Paper {...paperProps()}>
                    {this.renderItems({getItemProps, inputValue, highlightedIndex, selectedItem})}
                  </Paper>
                )}
              </div>
            )}
          </Downshift>,
          state.dialogOpened && this.renderDialog()
        ]

    );
  }
}

export default withStyles(FieldInfinitDownshift);

