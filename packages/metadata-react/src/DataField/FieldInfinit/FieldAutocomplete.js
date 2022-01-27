/**
 * ### Поле ввода ссылочных данных на базе Autocomplete
 *
 * @module Autocomplete
 *
 * Created 30.04.2021.
 */

import React from 'react';
import PropTypes from 'prop-types';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import Autocomplete from '@material-ui/lab/Autocomplete';
import cn from 'classnames';

import InputReadOnly from './InputReadOnly';
import InputEditable from './InputEditable';
import OuterDialog from './OuterDialog';
import PaperComponent, {prevent} from './PaperComponent';
import AbstractField, {suggestionText} from '../AbstractField';
import withStyles from '../styles';
import ReactCalendar from 'rc-calendar';

const break_keys = {all: ['ArrowUp', 'ArrowDown'], open: ['Tab', 'Enter']} ;


class FieldAutocomplete extends AbstractField {

  constructor(props, context) {
    super(props, context);

    Object.assign(this.state, {
      open: false,
      dialogOpened: '',
      options: [this.masked_value(props)],
      error: false,
    })
  }

  masked_value(props) {
    const {empty_text, _obj, _fld} = (props || this.props);
    let value = _obj[_fld];
    if(empty_text && value && value.empty && value.empty()) {
      value = {
        ref: value.ref,
        get presentation() {
          return empty_text;
        },
        valueOf() {
          return this.ref;
        },
        toString() {
          return this.presentation;
        }
      };
    }
    return value;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const value = this.masked_value(nextProps);
    const {props, state} = this;
    if(!state.error && !state.options.some((opt) => this.getOptionSelected(opt, value))) {
      const options = [...state.options];
      options.unshift(value);
      this.setState({error: false, options});
      return false;
    }
    for(const fld of ['open', 'dialogOpened', 'options']) {
      if(state[fld] !== nextState[fld]) {
        return true;
      }
    }
    for(const fld in nextProps) {
      if(nextProps[fld] !== props[fld]) {
        return true;
      }
    }
    return false;
  }

  getOptionSelected(option, value) {
    return option.valueOf() == value.valueOf();
  }

  getChildContext() {
    return {owner: this};
  }

  loadMoreRows = (search = '', startIndex = 0, stopIndex = 100) => {
    const {props: {_obj, _fld}, state: {value}, _meta} = this;
    if(!value) {
      return;
    }
    const {_manager} = value;
    const select = _manager.get_search_selector({_obj, _fld, _meta, search, top: stopIndex, skip: startIndex, source_mode: 'ram'});
    if(_manager.metadata().main_presentation_name) {
      select._sort = [{field: 'name', direction: 'asc'}];
    }
    const {docs, count} = $p.utils._find_rows_with_sort.call(_manager, _manager.alatable, select);
    const options = [this.masked_value()];
    let added = 0;
    for (const {ref} of docs) {
      const o = _manager.by_ref[ref];
      if(o && !options.includes(o)) {
        options.push(o);
        added++;
      }
    }
    this.setState({options, error: false});
  };

  filter = (event, value, reason) => {
    if(reason === 'input') {
      this.loadMoreRows(value.trim().toLowerCase());
    }
  };

  onKeyDown = (evt) => {
    const {key} = evt;
    if(break_keys.all.includes(key) || (this.state.open && this.isTabular && break_keys.open.includes(key))) {
      prevent(evt);
    }
    else if(key === 'F4') {
      if(evt.ctrlKey && evt.shiftKey) {
        this.handleOpenObj(evt);
      }
      else {
        this.handleOpenList(evt);
      }
    }
    else if(key === 'F2') {
      prevent(evt);
      this.setState({open: !this.state.open});
    }
  };

  // заполняем options c учетом метаданных
  onOpen = () => {
    if(!this._inited) {
      this._inited = true;
      this.loadMoreRows();
    }
    this.setState({open: true});
  };

  onClose = () => {
    this.setState({open: false});
  };

  onChange = (e, value) => {
    super.onChange({target: {value}});
  };

  handleSelect = (value) => {
    if(value) {
      const {_obj, _fld, handleValueChange} = this.props;
      _obj[_fld] = value && value.ref ? value.ref : value;
      value = _obj[_fld];
      const loader = value && value.is_new() ? value.load() : Promise.resolve();
      loader
        .catch(() => null)
        .then(() => {
          this.setState({open: false, dialogOpened: '', value});
          handleValueChange && handleValueChange(value);
        });
    }
  };

  handleOpenList = (evt) => {
    const {_obj, _fld, tree} = this.props;
    this.setState({dialogOpened: tree ? 'tree' : 'list', open: false});
    prevent(evt);
  };

  handleOpenObj = (evt) => {
    const {_obj, _fld} = this.props;
    this.setState({dialogOpened: 'obj', open: false});
    prevent(evt);
  };

  handleCloseDialog = () => {
    this.setState({dialogOpened: ''});
  };

  renderInput = (iprops) => {
    const {props: {classes, extClasses, fullWidth, className,  mandatory, onClick}, state: {error}, _meta, isTabular, read_only} = this;
    const props = {_meta, isTabular, classes, extClasses, className, fullWidth, mandatory, onClick, error, value: this.masked_value()};
    return <InputEditable {...props} iprops={Object.assign({}, iprops, {fullWidth})} />;
  };

  render() {

    const {props, state: {options, open, dialogOpened}, _meta, isTabular, read_only} = this;
    const {classes, extClasses, fullWidth, _obj, _fld} = props;

    return (
      read_only ? <InputReadOnly
          _meta={_meta}
          isTabular={isTabular}
          classes={classes}
          extClasses={extClasses}
          fullWidth={fullWidth}
          inputValue={suggestionText(this.masked_value())}
          label_position={props.label_position}
        />
        :
        <>
          <Autocomplete
            //blurOnSelect
            disableClearable
            open={open}
            value={this.masked_value()}
            options={options}
            getOptionLabel={suggestionText}
            getOptionSelected={this.getOptionSelected}
            onOpen={this.onOpen}
            onClose={this.onClose}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            PaperComponent={PaperComponent}
            classes={{popper: classes.popper}}
            renderInput={this.renderInput}
            renderOption={(option) => <Typography noWrap>{suggestionText(option)}</Typography>}
            filterOptions={(options) => options}
            onInputChange={this.filter}
          />
          {dialogOpened && <OuterDialog
            _obj={_obj}
            _fld={_fld}
            _owner={this}
            dialogOpened={dialogOpened}
            handleSelect={this.handleSelect}
            handleCloseDialog={this.handleCloseDialog}
            components={this.context.components}
          />}
        </>
    );
  }
}

FieldAutocomplete.childContextTypes = {
  owner: PropTypes.object
};

FieldAutocomplete.contextTypes = {
  components: PropTypes.object,       // конструкторы DataList и FrmObj передаём через контекст, чтобы исключить зацикливание
};

export default withStyles(FieldAutocomplete);
