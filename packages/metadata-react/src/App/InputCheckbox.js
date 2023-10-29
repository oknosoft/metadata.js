/**
 *
 * @module InputCheckbox
 *
 */

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid";

import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import FilterNoneIcon from '@material-ui/icons/FilterNone';

export default class InputCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { list: props.list };
  }

  render() {
    const {
      state: { list },
    } = this;

    const handleChange = (event) => {
      list.find((item) => {
        if (item.value === event.target.value) {
          item.checked = !item.checked;
          this.setState({ list });
          return true;
        };
      });
    };

    const selectAll = () => {
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        item.checked = true;
      };
      this.setState({ list });
    };

    const unselectAll = () => {
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        item.checked = false;
      };
      this.setState({ list });
    };

    return (
      <FormControl component="fieldset">
        <Grid container spacing={1}>
          <Grid item>
            <IconButton onClick={selectAll}>
              <LibraryAddCheckIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton onClick={unselectAll}>
              <FilterNoneIcon />
            </IconButton>
          </Grid>
        </Grid>
        {list.map((item, index) => (
          <FormControlLabel
            key={`r-${index}`}
            control={
              <Checkbox
                value={item.value}
                checked={item.checked}
                onChange={handleChange}
              />
            }
            label={item.text || item.presentation || item.value || v}
          />
        ))}
      </FormControl>
    );
  }
}
