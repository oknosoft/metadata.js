/**
 *
 *
 * @module SelectTags
 *
 * Created by Evgeniy Malyarov on 17.04.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import withStyles from './styles';

function sort(a, b) {
  if(a.category.name > b.category.name) {
    return 1;
  }
  else if(a.category.name < b.category.name) {
    return -1;
  }
  else {
    if(a.name > b.name) {
      return 1;
    }
    else if(a.name < b.name) {
      return -1;
    }
    else{
      return 0;
    }
  }
}

class SelectTags extends React.Component {

  render() {
    const {classes, tags, handleChange, tagList, categories, ...other} = this.props;

    return (
      <FormControl className={classes.formControl} margin="dense" {...other}>
        <InputLabel>Разделы</InputLabel>
        <Select
          multiple
          value={tags}
          onChange={handleChange}
          input={<Input />}
          renderValue={selected => selected.map(v => $p.cat.tags.get(v).name).join(', ')}
        >
          {(categories ? tagList.sort(sort) : tagList).map((tag) => (
            <MenuItem key={tag.ref} value={tag.ref}>
              <Checkbox checked={tags.indexOf(tag.ref) > -1} />
              <ListItemText primary={tag.name} secondary={categories && tag.category.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

SelectTags.propTypes = {
  classes: PropTypes.object.isRequired,
  tags: PropTypes.array.isRequired,
  tagList: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  categories: PropTypes.bool,
};

export default withStyles(SelectTags);
