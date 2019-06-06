/**
 * Редактор массива значений
 *
 * @module ChipList
 *
 * Created by Evgeniy Malyarov on 20.04.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import {withStyles} from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(),
    left: 0,
    right: 0,
  },
  chip: {
    margin: theme.spacing() / 4,
  },
  chipRoot: {
    height: 'auto',
    marginRight: theme.spacing() / 2,
  },
  formControl: {
    // marginLeft: theme.spacing(),
    paddingRight: theme.spacing(),
    boxSizing: 'border-box',
    minWidth: 260,
  },
  inputRoot: {
    flexWrap: 'wrap',
  },
});

function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;

  return (
    <TextField
      className={classes.formControl}
      margin="dense"
      InputProps={{
        inputRef: ref,
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem.includes(suggestion.ref);

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.ref}
      selected={isHighlighted}
      component="div"
      style={{fontWeight: isSelected ? 500 : 400}}
    >
      {suggestion.name}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ref: PropTypes.string, name: PropTypes.string}).isRequired,
};

class ChipList extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      inputValue: '',
      selectedItem: props.selectedItems,
    };
  }

  getSuggestions(inputValue) {
    let count = 0;

    return this.props.items.filter(suggestion => {
      const keep = (!inputValue || suggestion.name.toLowerCase().includes(inputValue.toLowerCase())) && count < 20;
      if (keep) {
        count += 1;
      }
      return keep;
    });
  }

  itemPresentation(ref) {
    let res = '';
    this.props.items.some((item) => {
      if(item.ref === ref) {
        res = item.name;
        return true;
      }
    });
    return res || ref;
  }

  handleKeyDown = event => {
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && event.key === 'Backspace') {
      this.handleDelete(selectedItem[selectedItem.length - 1])();
    }
  };

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  handleChange = (item) => {
    let {state: { selectedItem }, props: {handleChange}}  = this;
    if (!selectedItem.includes(item)) {
      selectedItem = [...selectedItem, item];
    }
    this.setState({inputValue: '', selectedItem});
    handleChange({target: {value: selectedItem}});
  };

  handleDelete = (item) => () => {
    const selectedItem = [...this.state.selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({selectedItem});
    this.props.handleChange({target: {value: selectedItem}});
  };

  render() {
    const { classes, endAdornment, title, fullWidth } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem} itemToString={(item) => item.name}>
        {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue: inputValue2,
            selectedItem: selectedItem2,
            highlightedIndex,
          }) => (
          <div className={classes.container}>
            {renderInput({
              classes,
              fullWidth,
              InputProps: getInputProps({
                startAdornment: selectedItem.map(item => (
                  <Chip
                    key={item}
                    tabIndex={-1}
                    label={this.itemPresentation(item)}
                    className={classes.chip}
                    classes={{root: classes.chipRoot}}
                    onDelete={this.handleDelete(item)}
                  />
                )),
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
                placeholder: 'введите текст или ↓',
                endAdornment,
              }),
              label: title,
            })}
            {isOpen ? (
              <Paper className={classes.paper} square>
                {this.getSuggestions(inputValue2).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.ref }),
                    highlightedIndex,
                    selectedItem: selectedItem2,
                  }),
                )}
              </Paper>
            ) : null}
          </div>
        )}
      </Downshift>
    );
  }
}

ChipList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  endAdornment: PropTypes.node,
  title: PropTypes.string,
};


export default withStyles(styles)(ChipList);
