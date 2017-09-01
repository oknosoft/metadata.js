/**
 * ### Поле ввода ссылочных данных
 *
 * @module FieldText
 *
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import MenuItem from 'material-ui/Menu/MenuItem';
import IconButton from 'material-ui/IconButton';
//import IconCheckboxMultipleBlankOutline from './IconCheckboxMultipleBlankOutline'
import OpenInNew from 'material-ui-icons/OpenInNew';
import AddIcon from 'material-ui-icons/AddCircleOutline';
import TitleIcon from 'material-ui-icons/Title';

// import match from 'autosuggest-highlight/match';
// import parse from 'autosuggest-highlight/parse';
import {withStyles} from 'material-ui/styles';

import AbstractField from './AbstractField';

function renderSuggestion(suggestion, { query, isHighlighted }) {
  // const matches = match(suggestion.label, query);
  // const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {getSuggestionValue(suggestion)}
      </div>
    </MenuItem>
  );
}

function getSuggestionValue(suggestion) {
  return suggestion.toString();
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
    //height: 200,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3,
    left: 0,
    right: 0,
    zIndex: 3000,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  flex: {
    flex: 1,
  },
  a: {
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 3,
    whiteSpace: 'nowrap',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  textField: {
    width: '100%',
  },
});

class FieldAutosuggest extends AbstractField {

  constructor(props, context) {
    super(props, context);
    const {_obj, _fld, mandatory} = props;
    this.state = {
      value: _obj[_fld],
      suggestions: [],
    };
    if(_obj[_fld].is_new && _obj[_fld].is_new()){

    }
  }

  loadSuggestions = (event) => {

    const selection = {_top: 40};
    const {_obj, _fld} = this.props;
    const {choice_params} = this._meta;

    if (event && event.value) {
      selection.presentation = {like: event.value};
    }
    if (choice_params) {
      choice_params.forEach((choice) => {
        selection[choice.name] = choice.path;
      });
    }

    this.setState({
      _loading: true
    });

    return _obj[_fld]._manager.get_option_list(selection)
      .then((suggestions) => {
        this.setState({suggestions, _loading: false});
        return {suggestions};
      });
  }

  onChange = (event) => {
    const {_obj, _fld, handleValueChange} = this.props;
    _obj[_fld] = event.target.value;
    if(handleValueChange) {
      handleValueChange(event.target.value);
    }
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  handleFocus = () => this.setState({focused: true});
  handleBlur = () => this.setState({focused: false});

  renderSuggestionsContainer = (options) => {

    if(this.state.focused){
      const { containerProps, children } = options;
      const {_meta, props} = this;
      const {_obj, _fld, classes} = props;
      const {_manager} = _obj[_fld];
      const is_enm = $p.utils.is_enm_mgr(_manager);

      return <Paper {...containerProps} square>
        {children}
        {children && <Divider />}
        <div style={{display: 'flex'}}>
          {is_enm && <div>...</div>}
          {!is_enm && <a href="#" className={classes.a} title={_manager.frm_selection_name}>Показать все</a>}
          <Typography type="caption" color="inherit" className={classes.flex} > </Typography>
          {_meta.type.types.length > 1 && <IconButton className={classes.button} title="Выбрать тип значения"><TitleIcon /></IconButton>}
          {!is_enm && _manager.acl.indexOf('i') != -1 && <IconButton className={classes.button} title="Создать элемент"><AddIcon /></IconButton>}
          {!is_enm && <IconButton className={classes.button} title={_manager.frm_obj_name}><OpenInNew /></IconButton>}
        </div>
      </Paper>
    }
    return null;
  }

  renderInput = (inputProps) => {
    const { classes, home, value, ref, _meta, _fld, ...other } = inputProps;

    return this.isTabular ?
      <input
        type="text"
        name={_fld}
        value={value}
      />
      :
      <TextField
        autoFocus={home}
        className={classes && classes.textField}
        fullWidth
        margin="dense"
        value={value}
        inputRef={ref}
        label={_meta.synonym}
        title={_meta.tooltip || _meta.synonym}
        InputProps={{
          classes: {input: classes.input},
          placeholder: _fld,
          ...other,
        }}
      />;
  }

  render() {

    const {props, state, _meta} = this;
    const {classes, _fld} = props;

    //focusInputOnSuggestionClick
    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion,
        }}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        renderInputComponent={this.renderInput}
        suggestions={state.suggestions}
        onSuggestionsFetchRequested={this.loadSuggestions}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: true,
          classes,
          _meta,
          _fld,
          value: getSuggestionValue(state.value),
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
        }}
      />
    );
  }

}

export default withStyles(styles)(FieldAutosuggest);
