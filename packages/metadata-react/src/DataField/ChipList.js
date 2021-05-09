/**
 * Редактор массива значений
 *
 * @module ChipList
 *
 * Created by Evgeniy Malyarov on 20.04.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const filter = (options, {inputValue}) => {
  const text = inputValue.trim().toLowerCase();
  let count = 0;
  return options.filter(({name}) => {
    if(count < 30 && name.toLowerCase().includes(text)) {
      count += 1;
      return true;
    }
  });
};

class ChipList extends React.Component {

  handleChange = (e, value) => {
    this.props.handleChange({target: {value}});
  };

  itemPresentation = (ref) => {
    let res = '';
    this.props.items.some((item) => {
      if(item.ref == ref) {
        res = item.name;
        return true;
      }
    });
    return res || ref.name || ref;
  };

  render() {
    const { title, fullWidth, placeholder, items, selectedItems } = this.props;

    return <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      size="small"
      fullWidth={fullWidth}
      options={items}
      value={selectedItems}
      getOptionLabel={this.itemPresentation}
      filterOptions={filter}
      onChange={this.handleChange}
      renderInput={(params) => (
        <TextField {...params} label={title} placeholder={placeholder || 'Введите текст для поиска'} />
      )}
    />;
  }
}

ChipList.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string,
};


export default ChipList;
