/**
 * ### Поле ввода ссылочных данных на базе Autosuggest
 *
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Menu, {MenuItem} from 'material-ui/Menu';
import {ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import OpenInNew from 'material-ui-icons/OpenInNew';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import TitleIcon from 'material-ui-icons/Title';

// окно диалога, чтобы показать всплывающие формы
import DnR from '../DnR/Dialog'

// import match from 'autosuggest-highlight/match';
// import parse from 'autosuggest-highlight/parse';

import AbstractField from './AbstractField';
import withStyles from './styles';


class FieldAutosuggest extends AbstractField {

  static contextTypes = {
    components: PropTypes.object,       // конструкторы DataList и FrmObj передаём через контекст, чтобы исключить зацикливание
  };

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld, mandatory} = props;
    const value = _obj[_fld];
    this.state = {value, suggestions: []};
    if(value.is_new && value.is_new()) {

    }
  }

  loadSuggestions = (event) => {

    const selection = {_top: 40};
    const {_obj, _fld} = this.props;
    const {choice_params} = this._meta;

    if(event && event.value) {
      selection.presentation = {like: event.value};
    }
    if(choice_params) {
      choice_params.forEach((choice) => {
        selection[choice.name] = choice.path;
      });
    }

    this.setState({
      _loading: true
    });

    return _obj[_fld]._manager.get_option_list(selection)
      .then((suggestions) => {
        suggestions.push({_footer: true});
        this.setState({suggestions, _loading: false});
        return {suggestions};
      });
  };

  getSuggestionValue = (suggestion) => {
    const text = (suggestion._footer ? this.props._obj[this.props._fld] : suggestion).toString();
    return text === '_' ? '' : text;
  };

  handleSuggestionSelected = (event, {suggestion}) => {
    if(suggestion._footer){
      return;
    }
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = suggestion;
    handleValueChange && handleValueChange(suggestion);

  };

  handleSuggestionsClearRequested = () => {
    this.setState({suggestions: []});
  };

  // декоративное событие для перерисовки
  handleChange = (event, {newValue}) => {
    this.setState({value: newValue});
  };

  handleOpenList = (e) => {
    this.setState({dialog_open: 'list'});
  };

  handleOpenObj = (e) => {
    this.setState({dialog_open: 'obj'});
  };

  handleCloseDialog = (e) => {
    this.setState({dialog_open: false});
  };

  renderSuggestionsContainer = ({containerProps, children}) => {

    const { ref, ...restContainerProps } = containerProps;
    const callRef = isolatedScroll => {
      if (isolatedScroll !== null) {
        ref(isolatedScroll.component);
      }
    };

    const {_meta, props} = this;
    const {_obj, _fld, classes} = props;
    const {_manager} = _obj[_fld];
    const is_enm = $p.utils.is_enm_mgr(_manager);

    return (
      children && <Paper {...containerProps} square>
        {children}
        <ListItem>
          <ListItemIcon onClick={this.handleOpenList}><div className={classes.a}>{is_enm ? '...' : 'Показать все'}</div></ListItemIcon>
          <ListItemText inset primary=' '/>
          {_meta.type.types.length > 1 && <IconButton title="Выбрать тип значения"><TitleIcon/></IconButton>}
          {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton title="Создать элемент"><AddIcon/></IconButton>}
          {!is_enm && <IconButton title={_manager.frm_obj_name} onClick={this.handleOpenObj}><OpenInNew/></IconButton>}
        </ListItem>
      </Paper>
    );
  };

  renderSuggestion = (suggestion, {query, isHighlighted}) => {
    // const matches = match(suggestion.label, query);
    // const parts = parse(suggestion.label, matches);
    return suggestion._footer ? <Divider /> : <MenuItem selected={isHighlighted} component="div">{this.getSuggestionValue(suggestion)}</MenuItem>;
  };

  renderInput = (inputProps) => {

    const {classes, home, value, ref, _meta, _fld, fullWidth, ...other} = inputProps;
    //

    return this.isTabular ?
      <input
        type="text"
        value={value}
        title={_meta.tooltip || _meta.synonym}
        placeholder={_fld}
        onBlur={this.prevent}
        {...other}
      />
      :
      <TextField
        className={classes.formControl}
        autoFocus={home}
        fullWidth={fullWidth}
        margin="dense"
        value={value}
        inputRef={ref}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        onBlur={this.prevent}
        InputProps={{
          classes: {input: classes.input},
          placeholder: _fld,
          ...other,
        }}
      />;
  };

  prevent(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  renderDialog() {
    const {props, state, context} = this;

    if(state.dialog_open) {
      const {_obj, _fld, classes} = props;
      const {_manager, ref} = _obj[_fld];
      const _acl = $p.current_user.get_acl(_manager.class_name);
      const {DataList, DataObj} = context.components;
      const title = state.dialog_open == 'list' ?
        (_manager.metadata().list_presentation || _manager.metadata().synonym)
        :
        (_manager.metadata().obj_presentation || _manager.metadata().synonym);

      return <DnR title={title} onClose={this.handleCloseDialog}>
        {state.dialog_open == 'list' ?
          <DataList _mgr={_manager} _acl={_acl} handlers={{}}/>
          :
          <DataObj _mgr={_manager} _acl={_acl} match={{params: {ref}}} handlers={{}}/>
        }
      </DnR>;
    }
  }

  render() {

    const {props, state, _meta} = this;
    const {classes, _fld, fullWidth} = props;

    //focusInputOnSuggestionClick
    //autoFocus: true,
    //shouldRenderSuggestions
    //

    return <div>
      <Autosuggest
        id={`field_${_fld}`}
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        suggestions={state.suggestions}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        renderInputComponent={this.renderInput}
        renderSuggestion={this.renderSuggestion}
        onSuggestionsFetchRequested={this.loadSuggestions}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        focusInputOnSuggestionClick={false}
        shouldRenderSuggestions={() => true}
        inputProps={{
          classes,
          _meta,
          _fld,
          fullWidth,
          value: this.getSuggestionValue(state.value),
          onChange: this.handleChange,
        }}
      />
      {this.renderDialog()}
    </div>
    ;
  }

}

export default withStyles(FieldAutosuggest);
